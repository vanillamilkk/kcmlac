/*  Kami Cinta Mam Lilia
 *  Official Anti Cheat Client
 * 
 *  Copyright vanillamilkk 2021
 *  GNU General Public License v3.0
 */

const { app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const exec = require('child_process').exec;
var os = require('os');
const { dialog } = require('electron');
const screenshot = require('screenshot-desktop');
const remote = require('@electron/remote/main').initialize();


global.id = null;
var loggedin = false;

ipcMain.on( "setMyGlobalVariable", ( event, myGlobalVariableValue ) => {
  global.id = myGlobalVariableValue;
} );

app.whenReady().then(() => {
  isRunning('csgo.exe', 'csgo_osx64', 'csgo_linux64').then((v) => {
      if (v) {
          createWindow();
          loop();
    } else {
        dialog.showMessageBox(null, options).then(result => {
            if (result.response === 0) {
                app.quit();
            }
        }
        )}});
})

function checkLogin () {
    if (global.id == null) {
        return false;
    } else {
        return true;
    }
}

function loop () {
     setInterval(function(){ screenshot(settings); }, 3000);
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function createWindow () {
  const win = new BrowserWindow({
    width: 420,
    height: 210,
    icon: 'icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  
 // win.removeMenu();
  win.loadFile('index.html')
}

function isRunning(win, mac, linux){
    return new Promise(function(resolve, reject){
        const plat = process.platform
        const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
        const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
        if(cmd === '' || proc === ''){
            resolve(false)
        }
        exec(cmd, function(err, stdout, stderr) {
            resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
        })
    })
}

const options = {
    type: 'error',
    buttons: ['Tutup'],
    title: 'KCML-AC',
    message: 'CS:GO tidak terdeteksi',
    detail: 'Tidak dapat terhubung ke proses CS:GO, harap restart game atau PC!',
  };
  
const settings = {
    format: 'png',
    filename: Date.now() + '.png'
};
