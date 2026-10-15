const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  api: {
    get: (route) => ipcRenderer.invoke('modrinth:get', route),
  },
  download: {
    start: (payload) => ipcRenderer.invoke('download:start', payload),
    cancel: (id) => ipcRenderer.invoke('download:cancel', id),
    onProgress: (cb) => {
      const listener = (_event, data) => cb(data);
      ipcRenderer.on('download:progress', listener);
      return () => ipcRenderer.removeListener('download:progress', listener);
    },
  },
  system: {
    getPaths: () => ipcRenderer.invoke('app:getPaths'),
    chooseDirectory: () => ipcRenderer.invoke('dialog:chooseDirectory'),
    showInFolder: (p) => ipcRenderer.invoke('shell:showInFolder', p),
    openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
    setTheme: (theme) => ipcRenderer.invoke('theme:set', theme),
  },
  settings: {
    load: () => ipcRenderer.invoke('settings:load'),
    save: (s) => ipcRenderer.invoke('settings:save', s),
  },
  win: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onState: (cb) => {
      const listener = (_event, data) => cb(data);
      ipcRenderer.on('window:state', listener);
      return () => ipcRenderer.removeListener('window:state', listener);
    },
  },
});
