import { app, BrowserWindow } from 'electron'
import { RendererDelegate } from './renderer-delegate';
import { test1 } from './tests';

const DEV = process.env.NODE_ENV === 'development';
if(!DEV) app.disableHardwareAcceleration();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let rendererDelegate

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

console.log('process.env.NODE_ENV', process.env.NODE_ENV)


function createWindow () {
  mainWindow = new BrowserWindow({
    'min-height': 620,
    'min-width': 1000,
    height: 620,
    width: 1000,
    // show: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    }
  })

  // mainWindow.webContents.on('did-finish-load', () => mainWindow.show())

  mainWindow.setMenu(null)
  mainWindow.maximize()
  mainWindow.loadURL(winURL)
  if(DEV){
    mainWindow.openDevTools()
  }

  mainWindow.on('closed', () => {
    app.quit()
    mainWindow = null
  })
}

app.on('ready', () => {
  test1()
  return
  createWindow()
  rendererDelegate = new RendererDelegate();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if(!DEV) app.quit()
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
