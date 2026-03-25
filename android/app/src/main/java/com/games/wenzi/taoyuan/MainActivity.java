package games.bygas.gakoy;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

import java.util.Map;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";
    private View loadingOverlay;
    private View enterButton;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean loadingDismissed = false;
    private SaveMigrator migrator;
    private Runnable enterButtonRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Tam ekran durum çubuğu
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller =
            new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);

        // BridgeActivity kendi WebView düzenini oluşturur,
        // yükleme katmanını bunun üstüne elle ekliyoruz
        loadingOverlay = getLayoutInflater().inflate(R.layout.activity_main, null);
        addContentView(loadingOverlay, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        enterButton = loadingOverlay.findViewById(R.id.enterButton);

        // "Oyuna Gir" butonuna basınca yükleme katmanını kapat
        enterButton.setOnClickListener(v -> dismissLoading());

        // 5 saniye sonra hâlâ yüklenmediyse giriş butonunu göster
        enterButtonRunnable = () -> {
            if (!loadingDismissed && enterButton != null) {
                enterButton.setVisibility(View.VISIBLE);
                enterButton.setAlpha(0f);
                enterButton.animate().alpha(1f).setDuration(300).start();
            }
        };
        handler.postDelayed(enterButtonRunnable, 5000);

        WebView webView = getBridge().getWebView();
        if (webView != null) {
            // JS arayüzünü kaydet, böylece WebView native tarafa yükleme ekranını gizleyebilir
            webView.addJavascriptInterface(new Object() {
                @android.webkit.JavascriptInterface
                public void hideLoading() {
                    runOnUiThread(() -> dismissLoading());
                }
            }, "NativeApp");

            // Capacitor sayfayı yükledikten sonra Vue render tamamlandı mı diye kontrol eden scripti gecikmeli ekle
            handler.postDelayed(() -> {
                WebView wv = getBridge().getWebView();
                if (wv != null) {
                    wv.evaluateJavascript(
                        "(function check() {" +
                        "  var app = document.getElementById('app');" +
                        "  if (app && app.children.length > 0) {" +
                        "    NativeApp.hideLoading();" +
                        "  } else {" +
                        "    setTimeout(check, 200);" +
                        "  }" +
                        "})();",
                        null
                    );
                }
            }, 500);

            // Kayıt taşıma: eski http://localhost:8080 sürümünden Capacitor içindeki https://localhost sürümüne taşı
            migrator = new SaveMigrator(this);
            migrator.migrate(new SaveMigrator.OnMigrationListener() {
                @Override
                public void onMigrationComplete(Map<String, String> saves) {
                    Log.d(TAG, "Kayıt taşıma başarılı, toplam " + saves.size() + " kayıt, ekleme bekleniyor...");

                    // Gecikmeli ekle, böylece Capacitor WebView sayfasının yüklendiğinden emin oluruz
                    handler.postDelayed(() -> {
                        WebView wv = getBridge().getWebView();
                        if (wv != null) {
                            SaveMigrator.injectSaves(wv, saves, MainActivity.this);
                            Toast.makeText(
                                MainActivity.this,
                                "Kayıt taşıma tamamlandı! Yeniden yükleniyor...",
                                Toast.LENGTH_LONG
                            ).show();
                        }
                    }, 2000);
                }

                @Override
                public void onMigrationSkipped(String reason) {
                    Log.d(TAG, "Kayıt taşıma atlandı: " + reason);
                }
            });
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacksAndMessages(null);

        // Taşıyıcı kaynaklarını temizle
        if (migrator != null) {
            migrator.cleanup();
            migrator = null;
        }
    }

    private void dismissLoading() {
        if (loadingDismissed || loadingOverlay == null) return;
        loadingDismissed = true;

        // Sadece giriş butonunun zaman aşımı callback'ini kaldır,
        // tüm callback'leri temizleme
        if (enterButtonRunnable != null) {
            handler.removeCallbacks(enterButtonRunnable);
        }

        loadingOverlay.animate()
            .alpha(0f)
            .setDuration(300)
            .withEndAction(() -> loadingOverlay.setVisibility(View.GONE))
            .start();
    }
}
