import { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage, session } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import pkg from '../package.json'

// Uygulama kök dizini (geliştirmede proje kökü, paketlendikten sonra app.asar)
const appRoot = app.getAppPath()

// preload yolu
const preloadPath = path.join(appRoot, 'dist-electron', 'preload.js')

// Derleme çıktısı yolu (Vite docs/ klasörüne çıkarır)
const docsPath = path.join(appRoot, 'docs')

// Statik varlık yolu
const publicPath = path.join(appRoot, 'public')

// Ayar dosyası yolu
const settingsPath = path.join(app.getPath('userData'), 'settings.json')

// Varsayılan ayarlar
const defaultSettings = {
  closeToTray: false, // Pencere kapanırken sistem tepsisine gizle
  autoLaunch: false // Bilgisayar açılınca otomatik başlat
}

// Ayarları oku
const loadSettings = () => {
  try {
    if (fs.existsSync(settingsPath)) {
      return { ...defaultSettings, ...JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return { ...defaultSettings }
}

// Ayarları kaydet
const saveSettings = s => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(s, null, 2))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

let settings = loadSettings()
let win = null
let tray = null
let isQuitting = false

// Sistem tepsisini kaldır
const destroyTray = () => {
  if (tray) {
    tray.destroy()
    tray = null
  }
}

// Bilgisayar açılınca otomatik başlatmayı ayarla
const setAutoLaunch = enable => {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: app.getPath('exe')
  })
}

// Sistem tepsisini oluştur
const createTray = () => {
  if (tray) return

  const iconPath = path.join(publicPath, 'favicon.ico')
  const trayIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty()

  tray = new Tray(trayIcon)
  tray.setToolTip(pkg.title)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Pencereyi Göster', click: () => win?.show() },
    { type: 'separator' },
    {
      label: 'Çıkış',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => win?.show())
}

// Uygulama menüsünü oluştur
const createAppMenu = () => {
  const template = [
    {
      label: 'Ayarlar',
      submenu: [
        {
          label: 'Kapatınca sistem tepsisine küçült',
          type: 'checkbox',
          checked: settings.closeToTray,
          click: menuItem => {
            settings.closeToTray = menuItem.checked
            saveSettings(settings)
            if (settings.closeToTray) {
              createTray()
            } else {
              destroyTray()
            }
          }
        },
        {
          label: 'Bilgisayar açılınca otomatik başlat',
          type: 'checkbox',
          checked: settings.autoLaunch,
          click: menuItem => {
            settings.autoLaunch = menuItem.checked
            saveSettings(settings)
            setAutoLaunch(settings.autoLaunch)
          }
        },
        {
          label: 'Oyundan Çık',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            isQuitting = true
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Geliştirici',
      submenu: [
        {
          label: 'Geliştirici Araçları',
          accelerator: 'F12',
          click: () => win?.webContents.toggleDevTools()
        },
        {
          label: 'Yeniden Yükle',
          accelerator: 'CmdOrCtrl+R',
          click: () => win?.webContents.reload()
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// Pencereyi oluştur
const createWindow = () => {
  win = new BrowserWindow({
    title: pkg.title,
    icon: path.join(publicPath, 'favicon.ico'),
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    }
  })

  createAppMenu()
  win.loadFile(path.join(docsPath, 'index.html'))

  // WebDAV CORS aşımı: aynı kökenden olmayan tüm isteklere CORS yanıt başlıkları ekle
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders }
    headers['access-control-allow-origin'] = ['*']
    headers['access-control-allow-methods'] = ['GET, PUT, DELETE, PROPFIND, HEAD, OPTIONS']
    headers['access-control-allow-headers'] = ['Authorization, Content-Type, Depth']
    // Tarayıcının yerel kimlik doğrulama penceresi açmasını engellemek için WWW-Authenticate başlığını kaldır
    // (kimlik doğrulama hataları uygulama içinde ele alınır)
    delete headers['www-authenticate']
    delete headers['WWW-Authenticate']
    callback({ responseHeaders: headers })
  })

  // Pencere kapanma olayı
  win.on('close', e => {
    if (settings.closeToTray && !isQuitting) {
      e.preventDefault()
      win.hide()
      createTray()
    }
  })
}

// IPC işlemleri
ipcMain.handle('get-settings', () => settings)

ipcMain.handle('set-settings', (_, newSettings) => {
  settings = { ...settings, ...newSettings }
  saveSettings(settings)

  // Otomatik başlatmayı işle
  setAutoLaunch(settings.autoLaunch)

  // Sistem tepsisini işle
  if (settings.closeToTray) {
    createTray()
  } else {
    destroyTray()
  }

  return { needRestart: false }
})

ipcMain.handle('restart-window', () => {
  if (win) {
    const bounds = win.getBounds()
    win.destroy()
    createWindow()
    win.setBounds(bounds)
  }
})

ipcMain.handle('quit-app', () => {
  isQuitting = true
  app.quit()
})

app.whenReady().then(() => {
  createWindow()

  // Sistem tepsisi özelliği açıksa tepsiyi oluştur
  if (settings.closeToTray) {
    createTray()
  }

  // Bilgisayar açılınca otomatik başlatma ayarını uygula
  setAutoLaunch(settings.autoLaunch)
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win) {
    win.show()
  } else {
    createWindow()
  }
})
