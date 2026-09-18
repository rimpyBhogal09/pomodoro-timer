const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 650,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  Menu.setApplicationMenu(null);
  win.loadFile('index.html');
}

ipcMain.on('minimize-window',()=>{
  BrowserWindow.getFocusedWindow().minimize();
});
ipcMain.on('close-window',()=>{
  BrowserWindow.getFocusedWindow().close();
});
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});