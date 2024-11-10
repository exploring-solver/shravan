// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Installation handlers
ipcMain.handle('install-ollama', async () => {
  return new Promise((resolve, reject) => {
    // For Windows, download and run Ollama installer
    const ollamaInstallCommand = 'powershell.exe -Command "' +
      'Invoke-WebRequest -Uri https://ollama.ai/download/windows -OutFile ollama-installer.exe;' +
      './ollama-installer.exe"';
    
    exec(ollamaInstallCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Ollama installation failed: ${error}`);
        return;
      }
      resolve('Ollama installed successfully');
    });
  });
});

ipcMain.handle('install-shravan', async () => {
  return new Promise((resolve, reject) => {
    exec('pip install shravan', (error, stdout, stderr) => {
      if (error) {
        reject(`shravan installation failed: ${error}`);
        return;
      }
      resolve('shravan installed successfully');
    });
  });
});

ipcMain.handle('start-shravan', async () => {
  return new Promise((resolve, reject) => {
    exec('shravan start', (error, stdout, stderr) => {
      if (error) {
        reject(`shravan start failed: ${error}`);
        return;
      }
      resolve('shravan started successfully');
    });
  });
});

ipcMain.handle('login-shravan', async () => {
  return new Promise((resolve, reject) => {
    exec('shravan login', (error, stdout, stderr) => {
      if (error) {
        reject(`shravan login failed: ${error}`);
        return;
      }
      resolve('shravan login successful');
    });
  });
});

// Handle app lifecycle
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});