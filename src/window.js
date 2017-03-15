window.__MACOS__ = /Mac/.test(window.navigator.platform)
if (typeof require === 'function') {
  const { ipcRenderer } = require('electron')
  const storage = require('electron-json-storage')
  const PAGE_INIT_ARGS = 'PAGE_INIT_ARGS'
  const PAGE_SIGN_ARGS = 'PAGE_SIGN_ARGS'
  const PAGE_MAIN_ARGS = 'PAGE_MAIN_ARGS'
  const IPCMAIN = {
    [PAGE_INIT_ARGS]: {
      name              : 'init',
      width             : 1000,
      height            : 540,
      frame             : !window.__MACOS__,
      resizable         : false
    },
    [PAGE_SIGN_ARGS]: {
      name              : 'sign',
      width             : 930,
      height            : 540,
      frame             : !window.__MACOS__,
      resizable         : false
    },
    [PAGE_MAIN_ARGS]: {
      name              : 'main',
      width             : 1280,
      height            : 640,
      minWidth          : 1000,
      minHeight         : 540,
      frame             : !window.__MACOS__,
      resizable         : true
    }
  }

  window.storage = storage

  window.reload = (type, auth = null) => {
    const ipc = ipcRenderer
    let opts = IPCMAIN[type]
    opts.auth = auth
    ipc.send('interface', opts)
  }

  // 保存用户图片
  window.saveImage = (image) => {
    const ipc = ipcRenderer
    ipc.send('save_image', image)
  }

  // 最大化窗口
  window.maximize = () => {
    const ipc = ipcRenderer
    ipc.send('maximize', null)
  }

  // 窗口集合操作
  window.winTools = (name) => {
    const ipc = ipcRenderer
    ipc.send('win-tools', name)
  }

  window.ipcRenderer = ipcRenderer
  
}