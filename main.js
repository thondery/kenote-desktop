
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url  = require('url')

let win

function createWindow () {
  win = new BrowserWindow({
    width      : 930,
    height     : 540,
    frame      : false,
    resizable  : false
  })
  win.loadURL(url.format({
    protocol: 'file:',
    slashes: true,
    pathname: path.join(__dirname, './dist/index.html'),
  }))
}

  

app.on('ready', createWindow)