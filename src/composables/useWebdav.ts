import { ref, computed } from 'vue'
import { Capacitor, CapacitorHttp } from '@capacitor/core'
import { parseSaveData } from '@/stores/useSaveStore'

const STORAGE_KEY = 'taoyuanxiang_webdav'
const SAVE_KEY_PREFIX = 'taoyuanxiang_save_'
const MAX_SLOTS = 3

export interface WebdavConfig {
  enabled: boolean
  serverUrl: string
  path: string
  username: string
  password: string
}

const defaultConfig = (): WebdavConfig => ({
  enabled: false,
  serverUrl: '',
  path: '',
  username: '',
  password: ''
})

const loadConfig = (): WebdavConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultConfig(), ...JSON.parse(raw) }
  } catch {
    /* yok say */
  }
  return defaultConfig()
}

/** Yapılandırmayı kalıcı sakla */
const config = ref<WebdavConfig>(loadConfig())
const testStatus = ref<'idle' | 'testing' | 'success' | 'failed'>('idle')
const testError = ref('')

/** Electron ortamında mı çalışıyor denetle */
const isElectron = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')

/** Platforma göre uyarlanan HTTP isteği: yerel platformda CapacitorHttp, geliştirme ortamında Vite vekili, Electron/üretim webde doğrudan bağlantı */
const webdavFetch = async (
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
): Promise<{ status: number; data: string }> => {
  // Yerel platform (Capacitor Android/iOS): CapacitorHttp ile CORS engelini aş
  if (Capacitor.isNativePlatform()) {
    const res = await CapacitorHttp.request({ url, method, headers, data: body })
    return { status: res.status, data: typeof res.data === 'string' ? res.data : JSON.stringify(res.data) }
  }

  // Geliştirme ortamı (Electron değil): Vite vekil katmanı ile CORS engelini aş
  if (import.meta.env.DEV && !isElectron) {
    const res = await fetch('/__webdav', {
      method,
      headers: { ...headers, 'x-webdav-url': url },
      body
    })
    return { status: res.status, data: await res.text() }
  }

  // Electron (ana süreçte CORS başlıkları eklenmiş) / üretim web (aynı kaynak): doğrudan bağlan
  // credentials: 'omit' ile tarayıcının yerel kimlik doğrulama penceresi açılmasın
  const res = await fetch(url, { method, headers, body, credentials: 'omit' })
  return { status: res.status, data: await res.text() }
}

/** serverUrl alanına göre uygun yol ipucu döndür */
const getPathHint = (serverUrl: string): string => {
  try {
    const host = new URL(serverUrl).hostname.toLowerCase()
    if (host.includes('jianguoyun')) return 'Jianguoyun için "Saklama yolu" kısmına mevcut bir klasör adı yazın; örnek: "Benim Jianguoyun".'
    if (host.includes('nextcloud') || serverUrl.includes('/remote.php/dav')) return 'Nextcloud için "Saklama yolu" kısmına hedef klasör adını yazın.'
    if (host.includes('owncloud') || serverUrl.includes('/remote.php/webdav')) return 'ownCloud için "Saklama yolu" kısmına hedef klasör adını yazın.'
  } catch {
    /* yok say */
  }
  return '"Saklama yolu" kısmına mevcut bir klasör adı yazın.'
}

export const useWebdav = () => {
  const webdavConfig = config
  const webdavTestStatus = testStatus
  const webdavTestError = testError

  const webdavReady = computed(() => config.value.enabled && testStatus.value === 'success')

  const saveConfig = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
  }

  /** URL sonuna / eklenmesini garanti et */
  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim().replace(/\/+$/, '')
    return trimmed ? trimmed + '/' : ''
  }

  /** serverUrl + path birleştirip tam klasör URL’si oluştur (Türkçe ve özel karakterler için percent-encode uygulanır) */
  const fullDirUrl = (): string => {
    const base = normalizeUrl(config.value.serverUrl)
    const sub = config.value.path.trim().replace(/^\/+|\/+$/g, '')
    if (!sub) return base
    const encoded = sub
      .split('/')
      .map(s => encodeURIComponent(s))
      .join('/')
    return base + encoded + '/'
  }

  /** Basic Auth başlığı üret */
  const authHeaders = (): Record<string, string> => ({
    Authorization: 'Basic ' + btoa(config.value.username + ':' + config.value.password)
  })

  /** Uzak sunucudaki kayıt yolu */
  const remoteFilePath = (slot: number): string => fullDirUrl() + `taoyuan_save_${slot}.tyx`

  /** Bağlantıyı sına: Web/Electron için PROPFIND, yerel platform için HEAD (CapacitorHttp PROPFIND desteklemez) */
  const testConnection = async (): Promise<boolean> => {
    testStatus.value = 'testing'
    testError.value = ''
    try {
      const base = normalizeUrl(config.value.serverUrl)
      if (!base) {
        testStatus.value = 'failed'
        testError.value = 'Sunucu adresi boş'
        return false
      }

      const url = fullDirUrl()
      const isNative = Capacitor.isNativePlatform()

      // Yerel platformda CapacitorHttp PROPFIND desteklemez, bu yüzden HEAD kullanılır
      const method = isNative ? 'HEAD' : 'PROPFIND'
      const headers = isNative ? authHeaders() : { ...authHeaders(), Depth: '0' }
      const res = await webdavFetch(url, method, headers)

      // PROPFIND başarılıysa 207 döner; HEAD ise genelde 200/207
      if (res.status === 207 || (isNative && res.status >= 200 && res.status < 300)) {
        testStatus.value = 'success'
        return true
      }

      testStatus.value = 'failed'
      if (res.status === 401 || res.status === 403) {
        testError.value = 'Kimlik doğrulama başarısız, kullanıcı adı ve şifreyi gözden geçirin'
      } else if (res.status === 404) {
        testError.value = 'Yol bulunamadı. ' + getPathHint(config.value.serverUrl)
      } else if (res.status === 405) {
        testError.value = 'Sunucu WebDAV desteklemiyor'
      } else {
        testError.value = `Sunucu ${res.status} yanıtı verdi`
      }
      return false
    } catch (e: unknown) {
      testStatus.value = 'failed'
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')) {
        testError.value = 'Ağ hatası, adresin doğru olduğundan emin olun'
      } else {
        testError.value = msg || 'Bağlantı kurulamadı'
      }
      return false
    }
  }

  /** Uzak klasörün varlığını garanti et (MKCOL); zaten varsa 405/409 normal sayılır */
  const ensureDirectory = async (): Promise<void> => {
    const url = fullDirUrl()
    if (!url) return
    try {
      await webdavFetch(url, 'MKCOL', authHeaders())
    } catch {
      /* yok say: klasör oluşturulamasa da yüklemeyi hemen kesme */
    }
  }

  /** Kaydı WebDAV’a yükle */
  const uploadSave = async (slot: number): Promise<{ success: boolean; message: string }> => {
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`)
    if (!raw) return { success: false, message: 'Yerel kayıt bulunamadı.' }

    try {
      let res = await webdavFetch(
        remoteFilePath(slot),
        'PUT',
        {
          ...authHeaders(),
          'Content-Type': 'application/octet-stream'
        },
        raw
      )

      // 404 çoğunlukla uzak klasör yok demektir; MKCOL ile oluşturmaya çalışıp yeniden dene
      if (res.status === 404) {
        await ensureDirectory()
        res = await webdavFetch(
          remoteFilePath(slot),
          'PUT',
          {
            ...authHeaders(),
            'Content-Type': 'application/octet-stream'
          },
          raw
        )
      }

      if (res.status >= 200 && res.status < 300) {
        return { success: true, message: `Kayıt ${slot + 1} buluta yüklendi.` }
      }
      if (res.status === 404) {
        return { success: false, message: 'Yükleme yolu geçersiz. ' + getPathHint(config.value.serverUrl) }
      }
      return { success: false, message: `Yükleme başarısız (${res.status}).` }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata'
      return { success: false, message: `Yükleme başarısız: ${msg}` }
    }
  }

  /** Kaydı WebDAV’dan indir */
  const downloadSave = async (slot: number): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await webdavFetch(remoteFilePath(slot), 'GET', authHeaders())
      if (res.status === 404) {
        return { success: false, message: `Bulutta ${slot + 1}. kayıt bulunmuyor.` }
      }
      if (res.status < 200 || res.status >= 300) {
        return { success: false, message: `İndirme başarısız (${res.status}).` }
      }
      if (!parseSaveData(res.data)) {
        return { success: false, message: 'Buluttaki kayıt verisi geçersiz ya da bozulmuş.' }
      }
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slot}`, res.data)
      return { success: true, message: `Kayıt ${slot + 1} buluttan indirildi.` }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata'
      return { success: false, message: `İndirme başarısız: ${msg}` }
    }
  }

  /** Uzak kayıtların var olup olmadığını listele */
  const listRemoteSaves = async (): Promise<{ slot: number; exists: boolean }[]> => {
    const results: { slot: number; exists: boolean }[] = []
    for (let i = 0; i < MAX_SLOTS; i++) {
      try {
        const res = await webdavFetch(remoteFilePath(i), 'HEAD', authHeaders())
        results.push({ slot: i, exists: res.status >= 200 && res.status < 300 })
      } catch {
        results.push({ slot: i, exists: false })
      }
    }
    return results
  }

  return {
    webdavConfig,
    webdavTestStatus,
    webdavTestError,
    webdavReady,
    saveConfig,
    testConnection,
    uploadSave,
    downloadSave,
    listRemoteSaves
  }
}
