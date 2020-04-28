var ipcRenderer = require('electron').ipcRenderer

class API {
  constructor () {
    const apilist = ['getKey', 'login', 'getInfo', 'getAreaList', 'getMyChooseArea', 'getCoverList', 'setCover', 'updateRoomInfo', 'updateRoomTitle', 'updateRoomArea', 'startLive', 'stopLive', 'getRoomCan', 'setRoomSwitch', 'getConfig', 'setConfig', 'getWaitList', 'pickUser', 'rejectUser', 'searchUser', 'stopVoiceJoin', 'getDanmuConf']
    apilist.forEach(name => {
      this[name] = (...args) => {
        return this.requestAPI(name, ...args)
      }
    })
  }

  requestAPI (...args) {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('API', ...args).then((result) => {
        if (result.code === 0) {
          resolve(result.data)
        } else {
          reject(result)
        }
      }).catch((err) => { reject(err) })
    })
  }

  devtool () {
    ipcRenderer.send('devTool')
  }
}
class Danmaku {
  constructor () {
    this.onmessage = () => {}

    ipcRenderer.on('danmaku', (event, msg) => {
      this.onmessage(msg.cmd || 'unknown', msg)
    })
  }

  connect (roomid) {
    return ipcRenderer.invoke('danmaku', 'connect', roomid)
  }
}
window._API = new API()
window._Danmaku = new Danmaku()
