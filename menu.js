
const electron         = require('electron')
const pkg              = require('./package.json')
const __MACOS__        = process.platform === 'darwin'
const app              = electron.app
const appName          = '基诺笔记'

const ipcMain          = electron.ipcMain

let initialMenu = []
let mainMenu = (auth, win) => {
  let menuTemplate = []
  if (__MACOS__) {
    menuTemplate.unshift({
      label: appName,
      submenu: [
        {
          label: `关于 ${appName}`,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: `注销 ${auth.username}`,
          click: () => {
            if (win && win.webContents)
              win.webContents.send('logout')
          }
        },
        {
          type: 'separator'
        },
        {
          label: '退出',
          accelerator: 'Command+X',
          click: () => app.quit()
        }
      ]
    })
  }
  return menuTemplate
}

if (__MACOS__) {
  initialMenu.unshift({
    label: appName,
    submenu: [
      {
        label: `关于 ${appName}`,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        accelerator: 'Command+X',
        click: () => app.quit()
      }
    ]
  })
}

exports.init = initialMenu
exports.main = mainMenu