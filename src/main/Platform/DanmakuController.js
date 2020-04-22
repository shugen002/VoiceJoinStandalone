import { DanmakuConnection } from './DanmakuConnection'

export class DanmakuController {
  constructor (api, ipc) {
    this.api = api
    this.ipc = ipc
    this.connection = null
    this.roomId = 0
    this.shouldClose = true
  }

  async connect (roomId) {
    if (this.connection !== null) {
      return false
    }
    this.roomId = roomId
    this.shouldClose = false
    const res = (await this.api.getDanmuConf(roomId))
    if (res.code === 0) {
      this.connection = new DanmakuConnection(this.api.uid, roomId, res.data)
      this.listen()
    }
    return true
  }

  listen () {
    this.connection.on('needReconnect', () => {
      this.api.getDanmuConf(this.roomId).then((res) => {
        if (res.code === 0) {
          this.connection.reconnect(res.data)
        }
      })
    })
    this.connection.on('*', (msg) => {
      this.ipc().send('danmaku', msg)
    })
  }
}
