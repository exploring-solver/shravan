const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shravanAPI', {
  runshravanCommand: (command) => ipcRenderer.invoke('run-shravan-command', command),
});
