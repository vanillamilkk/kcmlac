/*  Kami Cinta Mam Lilia
 *  Official Anti Cheat Client
 * 
 *  Copyright vanillamilkk 2021
 *  GNU General Public License v3.0
 */

const { app, BrowserWindow, Menu, ipcMain, Notification} = require('electron');
const path = require('path');
const exec = require('child_process').exec;
var os = require('os');
const { dialog } = require('electron');
const screenshot = require('screenshot-desktop');
const remote = require('@electron/remote/main').initialize();
const axios = require('axios');
var fs = require('fs');
var querystring = require('querystring');



global.id = null;
var loggedin = false;

var now = new Date;
var utc_timestamp = Date.UTC( now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

ipcMain.on( "setMyGlobalVariable", ( event, myGlobalVariableValue ) => {
  global.id = myGlobalVariableValue;
  console.log("Retrived id = " + global.id);
  
} );

ipcMain.on('wrongLogin', (evt, arg) => {
  dialog.showMessageBox(null, wrongLogin).then(result => {
            if (result.response === 0) {
                app.quit();
            }
        })});

app.whenReady().then(() => {
  isRunning('csgo.exe', 'csgo_osx64', 'csgo_linux64').then((v) => {
      if (v) {
          createWindow();
          setInterval(function() {loop();} , 90000);
    } else {
        dialog.showMessageBox(null, noCSGO).then(result => {
            if (result.response === 0) {
                app.quit();
            }
        }
        )}});
})

function checkLogin() {
    if (global.id == null) {
        console.log( now + ' User not detected!' );
        return false;
    } else {
        console.log( now + ' User logged in' );
        return true;
    }
}

function loop() {
    if (checkLogin()) {
        screenshot(settings);
        console.log( now + ' Shot taken!' );
        setTimeout(  function() {uploadScreen();} , 3000 );
    }
}


app.on('window-all-closed', () => {
    app.quit()
})

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 220,
    icon: 'icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  
  win.removeMenu();
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

async function uploadScreen() {
  try {
    let image = fs.readFileSync(path.join( os.tmpdir(), 'screen.jpg' ));
    let sending_image_result = await axios({
       method: 'post',
       url: 'https://kcml.my.id/kcmlcup/ac/connect.php',
       data: image,
       headers: {
         'Content-Type': 'image/jpeg',
         'Content-Length': image.length, 
         'User-Agent': 'Mozilla/5.0 ' + os.type() + ' KCML AntiCheat Client',
         'X-Requested-With': global.id
       }
    });
  } catch (error) {
    console.log('Error: ', error);
  }
}


const noCSGO = {
    type: 'error',
    buttons: ['Tutup'],
    title: 'KCML-AC',
    message: 'CS:GO tidak terdeteksi',
    detail: 'Tidak dapat terhubung ke proses CS:GO, harap restart game atau PC!',
};

const wrongLogin = {
    type: 'error',
    buttons: ['Tutup'],
    title: 'KCML-AC',
    message: 'Login gagal!',
    detail: 'User ID salah, harap cek kembali atau hubungi panitia!',
};
  
const settings = {
    format: 'jpg',
    filename: path.join( os.tmpdir() , 'screen.jpg' )
};
