const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Ayarları al
  getSettings: () => ipcRenderer.invoke('get-settings'),

  // Ayarları kaydet
  setSettings: settings => ipcRenderer.invoke('set-settings', settings),

  // Pencereyi yeniden başlatın (sınır modunu değiştirmek için kullanılır)
  restartWindow: () => ipcRenderer.invoke('restart-window'),

  // Uygulamadan çıkın
  quitApp: () => ipcRenderer.invoke('quit-app')
})
