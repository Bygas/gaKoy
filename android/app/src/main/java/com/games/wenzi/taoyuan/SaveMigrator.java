package com.games.wenzi.taoyuan;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import fi.iki.elonen.NanoHTTPD;

/**
 * Tek seferlik kayıt taşıyıcı: Eski sürümdeki http://localhost:8080 adresinden localStorage verisini okur,
 * ve bunu Capacitor içindeki https://localhost WebView'ine aktarır.
 */
public class SaveMigrator {

    private static final String TAG = "SaveMigrator";
    private static final String PREFS_NAME = "save_migration";
    private static final String KEY_DONE = "migration_done_v2";
    private static final int OLD_PORT = 8080;

    private final Context context;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private MigrationServer server;
    private WebView hiddenWebView;
    private final ConcurrentHashMap<String, String> collectedSaves = new ConcurrentHashMap<>();
    private OnMigrationListener listener;
    private boolean finished = false;

    public interface OnMigrationListener {
        void onMigrationComplete(Map<String, String> saves);
        void onMigrationSkipped(String reason);
    }

    public SaveMigrator(Context context) {
        this.context = context;
    }

    /** Taşıma gerekip gerekmediğini kontrol et */
    public boolean needsMigration() {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return !prefs.getBoolean(KEY_DONE, false);
    }

    /** Taşıma tamamlandı olarak işaretle */
    public static void markDone(Context context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().putBoolean(KEY_DONE, true).apply();
    }

    /** Taşıma sürecini başlat */
    public void migrate(OnMigrationListener listener) {
        this.listener = listener;

        if (!needsMigration()) {
            listener.onMigrationSkipped("Zaten taşınmış, atlanıyor");
            return;
        }

        Log.d(TAG, "Kayıt taşıma başlıyor...");
        showToast("Eski sürüm kayıtları kontrol ediliyor...");

        try {
            // Taşıma sayfasını sunmak için NanoHTTPD başlat
            server = new MigrationServer(OLD_PORT);
            server.start();
            Log.d(TAG, "Taşıma sunucusu şu portta başlatıldı: " + OLD_PORT);

            // Eski origin'e erişmek için gizli WebView oluştur
            handler.post(() -> {
                hiddenWebView = new WebView(context);
                WebSettings settings = hiddenWebView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);

                hiddenWebView.addJavascriptInterface(new MigrationBridge(), "MigrationBridge");
                hiddenWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        Log.d(TAG, "Taşıma sayfası yüklendi: " + url);
                    }

                    @Override
                    public void onReceivedError(WebView view, int errorCode,
                                                String description, String failingUrl) {
                        Log.e(TAG, "Taşıma sayfası yüklenemedi: " + description);
                        finish("Sayfa yüklenemedi: " + description);
                    }
                });

                hiddenWebView.loadUrl("http://localhost:" + OLD_PORT + "/migration");
            });

            // 10 saniyelik zaman aşımı koruması
            handler.postDelayed(() -> {
                if (!finished) {
                    Log.w(TAG, "Taşıma zaman aşımına uğradı, atlanıyor");
                    finish("Taşıma zaman aşımı");
                }
            }, 10000);

        } catch (Exception e) {
            Log.e(TAG, "Taşıma başlatılamadı", e);
            finish("Sunucu başlatılamadı: " + e.getMessage());
        }
    }

    /** Taşımayı tamamla ve kaynakları temizle */
    private synchronized void finish(String skipReason) {
        if (finished) return;
        finished = true;
        cleanup();
        if (listener != null) {
            if (skipReason != null || collectedSaves.isEmpty()) {
                String reason = skipReason != null ? skipReason : "Eski sürümde kayıt verisi yok";
                Log.d(TAG, "Taşıma atlandı: " + reason);
                // Sadece veri olmadığı kesinleşirse tamamlandı işaretlenir,
                // hata/zaman aşımında işaretlenmez, bir sonraki açılışta tekrar denenir
                if ("Eski sürümde kayıt verisi yok".equals(reason)) {
                    markDone(context);
                }
                showToast("Eski sürüm kaydı bulunamadı (" + reason + ")");
                listener.onMigrationSkipped(reason);
            } else {
                // Eski kayıt bulundu, ama burada markDone() çağrılmaz
                // markDone, injectSaves içinde gerçekten başarıyla eklenince çağrılır
                Log.d(TAG, "Taşıma başarılı, toplam " + collectedSaves.size() + " kayıt");
                showToast(collectedSaves.size() + " adet eski sürüm kaydı bulundu, taşınıyor...");
                listener.onMigrationComplete(collectedSaves);
            }
        }
    }

    /** Toast bildirimi göster */
    private void showToast(String message) {
        handler.post(() -> Toast.makeText(context, message, Toast.LENGTH_LONG).show());
    }

    /** Kaynakları temizle */
    public void cleanup() {
        if (server != null) {
            server.stop();
            server = null;
        }
        handler.post(() -> {
            if (hiddenWebView != null) {
                hiddenWebView.destroy();
                hiddenWebView = null;
            }
        });
    }

    /** NanoHTTPD taşıma sunucusu, yalnızca bir taşıma HTML sayfası döndürür */
    private static class MigrationServer extends NanoHTTPD {
        MigrationServer(int port) {
            super(port);
        }

        @Override
        public Response serve(IHTTPSession session) {
            String html = "<!DOCTYPE html><html><body><script>"
                + "try {"
                + "  var saves = {};"
                + "  for (var i = 0; i < localStorage.length; i++) {"
                + "    var key = localStorage.key(i);"
                + "    if (key.indexOf('taoyuanxiang_save_') === 0) {"
                + "      saves[key] = localStorage.getItem(key);"
                + "    }"
                + "  }"
                + "  var keys = Object.keys(saves);"
                + "  if (keys.length === 0) {"
                + "    MigrationBridge.onNoData();"
                + "  } else {"
                + "    for (var j = 0; j < keys.length; j++) {"
                + "      MigrationBridge.onSaveData(keys[j], saves[keys[j]]);"
                + "    }"
                + "    MigrationBridge.onComplete(keys.length);"
                + "  }"
                + "} catch(e) {"
                + "  MigrationBridge.onError(e.message);"
                + "}"
                + "</script></body></html>";

            return newFixedLengthResponse(Response.Status.OK, "text/html", html);
        }
    }

    /** JS Bridge, eski origin'den gelen kayıt verilerini alır */
    private class MigrationBridge {
        @JavascriptInterface
        public void onSaveData(String key, String value) {
            Log.d(TAG, "Kayıt alındı: " + key + " (" + value.length() + " karakter)");
            collectedSaves.put(key, value);
        }

        @JavascriptInterface
        public void onComplete(int count) {
            Log.d(TAG, "Taşıma okuma işlemi tamamlandı, toplam " + count + " kayıt");
            handler.post(() -> finish(null));
        }

        @JavascriptInterface
        public void onNoData() {
            Log.d(TAG, "Eski origin'de kayıt verisi yok");
            handler.post(() -> finish("Eski sürümde kayıt verisi yok"));
        }

        @JavascriptInterface
        public void onError(String message) {
            Log.e(TAG, "Taşıma JS hatası: " + message);
            handler.post(() -> finish("JS hatası: " + message));
        }
    }

    /**
     * Yeni sürümde zaten kayıt var mı kontrol eder,
     * yoksa eski kayıtları ekler ve sayfayı yeniler
     */
    public static void injectSaves(WebView webView, Map<String, String> saves, Context context) {
        if (saves == null || saves.isEmpty()) return;

        // Önce yeni sürüm localStorage içinde kayıt var mı kontrol et
        webView.evaluateJavascript(
            "(function(){" +
            "  for(var i=0;i<localStorage.length;i++){" +
            "    if(localStorage.key(i).indexOf('taoyuanxiang_save_')===0) return 'has_data';" +
            "  }" +
            "  return 'empty';" +
            "})();",
            result -> {
                // evaluateJavascript dönüş değeri tırnaklı gelir, örnek: "\"has_data\""
                if (result != null && result.contains("has_data")) {
                    Log.d(TAG, "Yeni sürümde zaten kayıt var, üzerine yazmamak için taşıma ekleme atlandı");
                    new Handler(Looper.getMainLooper()).post(() ->
                        Toast.makeText(context, "Yeni sürümde zaten kayıt var, eski sürüm taşıması atlandı", Toast.LENGTH_LONG).show()
                    );
                    return;
                }

                // Yeni sürümde kayıt yok, güvenli şekilde ekle
                StringBuilder js = new StringBuilder("(function(){");
                for (Map.Entry<String, String> entry : saves.entrySet()) {
                    String key = escapeJs(entry.getKey());
                    String value = escapeJs(entry.getValue());
                    js.append("localStorage.setItem('").append(key).append("','").append(value).append("');");
                }
                js.append("location.reload();");
                js.append("})();");

                webView.evaluateJavascript(js.toString(), r -> {
                    Log.d(TAG, "Kayıt ekleme tamamlandı, toplam " + saves.size() + " kayıt, sayfa yenilendi");
                    // Sadece başarıyla eklenirse tamamlandı olarak işaretle
                    markDone(context);
                });
            }
        );
    }

    /** JS içindeki tek tırnaklı metinlerde özel karakterleri kaçır */
    private static String escapeJs(String s) {
        return s.replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
