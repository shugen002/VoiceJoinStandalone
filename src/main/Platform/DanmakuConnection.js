
import { GoIMConnection } from 'goimprotocol'
import EventEmitter from 'events'
import zlib from 'zlib'
export class DanmakuConnection extends EventEmitter {
  constructor (roomId) {
    super()
    this.connectConfig = {
      type: 'websocket',
      host: 'broadcastlv.chat.bilibili.com',
      path: 'sub',
      port: 443,
      wss: true,
      version: 2,
      authInfo: {
        uid: Math.floor(Math.random() * 1000000),
        roomid: roomId,
        protover: 2
      }
    }
    this.shouldClose = false
    this.logger = console
    this.roomId = roomId
    this.connection = new GoIMConnection(this.connectConfig)
    this.listen()
    this.connection.connect()
  }

  reconnect () {
    this.connection = new GoIMConnection(this.connectConfig)
    this.listen()
    this.connection.connect()
  }

  listen () {
    this.connection.on('connect', () => {
      this.logger.debug(`Room ${this.roomId} Connection Connected.`)
    })
    this.connection.on('error', (error) => {
      this.logger.error(`Room ${this.roomId} Got Error: `, error)
    })
    this.connection.on('close', (code, reason) => {
      this.logger.info(`Room ${this.roomId} Closed with ${code} ${reason}.`)
      if (this.shouldClose !== true) {
        this.reconnect()
      }
    })
    this.connection.on('heartbeatReply', (packet) => {
      try {
        this.emit('online', packet.body.readInt32BE(0))
      } catch (error) {
        this.logger.error(`Room ${this.roomId} Fail to parse heartbeat reply.`, error)
        this.logger.debug(`Room ${this.roomId} Fail to parse heartbeat reply.`, packet, error)
      }
    })
    this.connection.on('AuthSucceeded', () => {
      this.logger.info(`Room ${this.roomId} Connected.`)
    })
    this.connection.on('message', (packet) => {
      try {
        if (packet.protocolVersion === 2) {
          this.connection.__onData.bind(this.connection)(Buffer.from(zlib.inflateSync(packet.body)))
        } else {
          const message = JSON.parse(packet.body.toString())
          this.emit('*', message)
          if (message.cmd) {
            this.emit(message.cmd, message, this.roomId)
          } else {
            this.emit('unknownCmd', message, this.roomId)
          }
        }
      } catch (error) {
        this.logger.error(`Room ${this.roomId} Fail to parse message.`, error)
        this.logger.debug(`Room ${this.roomId} Fail to parse message.`, packet, error)
      }
    })
    this.connection.on('UnknownOperation', (packet) => {
      this.logger.debug(`Room ${this.roomId} Get Unknown Operation Packet.`, packet)
    })
  }

  __close () {
    this.shouldClose = true
    this.connection.close()
  }
}
