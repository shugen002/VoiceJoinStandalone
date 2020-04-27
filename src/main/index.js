import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { productName } from '../../package.json'
import Consts from './Consts'
import { WebAPI } from './Platform/WebAPI'
import { API } from './Platform/API'
import { DanmakuController } from './Platform/DanmakuController'

// set app name
app.name = productName
// to hide deprecation message
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const gotTheLock = app.requestSingleInstanceLock()

const isDebug = process.argv.includes('--debug')
let mainWindow

// only allow single instance of application
if (!Consts.isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow && mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    })
  } else {
    app.quit()
    process.exit(0)
  }
} else {
  // process.env.ELECTRON_ENABLE_LOGGING = true

  require('electron-debug')({
    showDevTools: false
  })
}

async function installDevTools () {
  try {
    /* eslint-disable */
    require('vue-devtools').install()
    /* eslint-enable */
  } catch (err) {
    console.log(err)
  }
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    // useContentSize: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webSecurity: false,
      preload: Consts.WINDOW_PRELOAD_SCRIPT,
      webviewTag: true
    },
    show: false,
    isDev: true,
    autoHideMenuBar: true
  })

  // eslint-disable-next-line
  setMenu()

  // load root file/url
  mainWindow.loadURL(Consts.WINDOW_URL)
  if (!Consts.isDev) {
    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    console.log('\nApplication exiting...')
  })
}

app.on('ready', () => {
  createWindow()

  if (Consts.isDev) {
    installDevTools()
    mainWindow.webContents.openDevTools()
  }

  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

const sendMenuEvent = async (data) => {
  mainWindow.webContents.send('change-view', data)
}

const template = [
  {
    label: app.name,
    submenu: [
      {
        label: 'Home',
        accelerator: 'CommandOrControl+H',
        click () {
          sendMenuEvent({ route: '/' })
        }
      },
      { type: 'separator' },
      { role: 'minimize' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'quit', accelerator: 'Alt+F4' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Get Help',
        role: 'help',
        accelerator: 'F1',
        click () {
          sendMenuEvent({ route: '/help' })
        }
      },
      {
        label: 'About',
        role: 'about',
        accelerator: 'CommandOrControl+A',
        click () {
          sendMenuEvent({ route: '/about' })
        }
      }
    ]
  }
]

function setMenu () {
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    template.push({
      role: 'window'
    })

    template.push({
      role: 'help'
    })

    template.push({ role: 'services' })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

const webAPI = new WebAPI()
const api = new API()

ipcMain.handle('API', async (event, apiName, ...args) => {
  if (webAPI[apiName]) {
    try {
      return { code: 0, data: await webAPI[apiName](...args) }
    } catch (error) {
      return { code: -2, msg: 'Unexpect Error', error }
    }
  } else {
    return { code: -1, msg: 'No Such API' }
  }
})

ipcMain.handle('API2', async (event, apiName, ...args) => {
  if (api[apiName]) {
    try {
      return { code: 0, data: await api[apiName](...args) }
    } catch (error) {
      return { code: -2, msg: 'Unexpect Error', error }
    }
  } else {
    return { code: -1, msg: 'No Such API' }
  }
})

ipcMain.on('devTool', () => {
  mainWindow.openDevTools()
})

const danmakuController = new DanmakuController(webAPI, () => { return mainWindow })
ipcMain.handle('danmaku', async (event, apiName, ...args) => {
  if (danmakuController[apiName]) {
    try {
      return { code: 0, data: await danmakuController[apiName](...args) }
    } catch (error) {
      return { code: -2, msg: 'Unexpect Error', error }
    }
  } else {
    return { code: -1, msg: 'No Such API' }
  }
})
if (Consts.isDev) {
  app.on('certificate-error', (event, webContents, url, error, certificate, callbackF) => {
    event.preventDefault()
    callbackF(true)
  })
}
