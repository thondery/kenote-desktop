
//const electron, { app, BrowserWindow, ipcMain } = require('electron')
const electron         = require('electron')
const fs               = require('fs')
const path             = require('path')
const storage = require('electron-json-storage')
const app              = electron.app
const BrowserWindow    = electron.BrowserWindow
const ipcMain          = electron.ipcMain

const pkg              = require('./package.json')
const menuTemplate     = require('./menu')

const __MACOS__        = process.platform === 'darwin'

let mainWindow, bounds

let mainArgs = {
  name         : 'init',
  width        : 1000,
  height       : 540,
  frame        : !__MACOS__,
  resizable    : false
}
const mainPage = `file://${__dirname}/dist/index.html`

if (__MACOS__) {
  app.setAboutPanelOptions({
    applicationName: '基诺笔记',
    applicationVersion: '1.0.0',
    copyright: 'Copyright (C) 2017 Kenode. All rights reserved',
    credits: 'Author: thondery@163.com',
    version: '1.0.0'
  })
}

const userData = app.getPath('userData')
storage.set('app', {
  name: pkg.name,
  version: pkg.version,
  userData: userData,
  platform: process.platform
})

// 创建用户数据目录
mkdirp('data')

let auth
let maximize = false

function openIt () {
  mainWindow = new BrowserWindow(mainArgs)
  mainWindow.loadURL(mainPage)
  mainWindow.webContents.openDevTools()
  mainWindow.on('close', () => {
    mainWindow = null
  })
  mainWindow.on('focus', function() {
    //console.log('focus');
    // ipc.send('focusWindow'); mainProcess没有该方法
    if(mainWindow && mainWindow.webContents)
      mainWindow.webContents.send('focusWindow');
  });
  mainWindow.on('blur', function() {
    //console.log('blur');
    //ipcMain.send('blurWindow')
    if(mainWindow && mainWindow.webContents)
      mainWindow.webContents.send('blurWindow');
  });
  //bindEvents(mainWindow)
  let Menu = electron.Menu
  let menu = Menu.buildFromTemplate(menuTemplate.init)
  Menu.setApplicationMenu(menu)
  ipcMain.on('interface', (evt, args) => {
    if (args.name === mainArgs.name) return
    console.log(args.name)
    mainArgs = args
    if (mainWindow) {
      bounds = mainWindow.getBounds()
      let x = (bounds.width - args.width) / 2 + bounds.x
      let y = (bounds.height - args.height) / 2 + bounds.y
      console.log(bounds)
      console.log({x: x, y: y, width: args.width, height: args.height })
      mainWindow.setBounds({ x: x, y: y, width: args.width, height: args.height }, true)
      mainWindow.setResizable(args.resizable)
      if (args.minWidth && args.minHeight) {
        mainWindow.setMinimumSize(args.minWidth, args.minHeight)
      }
      if (args.name === 'main') {
        //mainWindow.maximize()
        auth = args.auth
        if (auth) {
          mkdirp(`data/${auth._id}`)
          mkdirp(`data/${auth._id}/images`)
          let authMenuTemplate = menuTemplate.main(auth, mainWindow)
          menu = Menu.buildFromTemplate(authMenuTemplate)
          Menu.setApplicationMenu(menu)
        }
      }
      else if (args.name === 'sign') {
        menu = Menu.buildFromTemplate(menuTemplate.init)
        Menu.setApplicationMenu(menu)
      }
      
    }
  })
  ipcMain.on('maximize', (evt, args) => {
    if (!mainWindow.isMaximized()) {
      mainWindow.maximize()
    }
    else {
      mainWindow.unmaximize()
    }
  })
  ipcMain.on('win-tools', (evt, args) => {
    switch (args) {
      case 'close': 
        app.hide()
        break
      case 'quit': 
        app.quit()
        break
      case 'minimize': 
        mainWindow.minimize()
        break
      case 'fullscreen':
        let isFullscreen = mainWindow.isFullScreen()
        mainWindow.setFullScreen(!isFullscreen)
        break
      default:
        break
    }
  })
}



const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}
app.on('ready', openIt)
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('open-file', function(e) {
  // console.log('reopen');
  if(mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    openIt();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    openIt()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
////var menu = Menu.buildFromTemplate(template)
//Menu.setApplicationMenu(menu)


function mkdirp (name) {
  let dir = path.resolve(userData, name)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}