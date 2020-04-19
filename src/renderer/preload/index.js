var electron = require('electron')
console.log('as')
window.ipcRenderer = electron.ipcRenderer
window._API = (...args) => {
  return new Promise((resolve, reject) => {
    window.ipcRenderer.invoke('API', ...args).then((result) => {
      if (result.code === 0) {
        resolve(result.data)
      } else {
        reject(result)
      }
    }).catch((err) => { reject(err) })
  })
}
