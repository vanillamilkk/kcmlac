/*  Kami Cinta Mam Lilia
 *  Official Anti Cheat Client
 * 
 *  Copyright vanillamilkk 2021
 *  GNU General Public License v3.0
 */

const { app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    icon: 'icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  win.removeMenu();
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
