import axios from 'axios'
import https from 'https'
import Consts from '../Consts'

export class API {
  constructor () {
    this.cookies = ''
    this.csrf = ''
    this.uid = 0
    this.createAxios()
  }

  createAxios () {
    const config = {
      baseURL: 'https://api.live.bilibili.com',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
        Origin: 'https://live.bilibili.com',
        Referer: 'https://live.bilibili.com',
        Cookie: this.cookies
      }
    }
    if (Consts.isDev) {
      config.httpsAgent = new https.Agent({ rejectUnauthorized: false })
    }
    this.axios = axios.create(config)
  }

  async setCookies (cookies, csrf, uid) {
    this.cookies = cookies
    this.csrf = csrf
    this.uid = uid
    this.createAxios()
    return true
  }

  async getUserInfo () {
    return (await this.axios.get('/live_user/v1/UserInfo/live_info')).data
  }

  async getRoomCan (roomId) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/RoomCan', {
      params: {
        room_id: roomId
      }
    })).data
  }

  async setRoomSwitch (roomId, status) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/RoomSwitch', {
      params: {
        room_id: roomId,
        status: typeof status === 'number' ? status : (status ? 1 : 0)
      }
    })).data
  }

  async getConfig (roomId) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/getConfig', {
      params: {
        room_id: roomId
      }
    })).data
  }

  async setConfig (roomId, type, guard, medalStart, users = []) {
    return (await this.axios.post('/av/v1/VoiceJoinAnchor/setConfig', new URLSearchParams({
      room_id: roomId,
      type,
      guard,
      medal_start: medalStart,
      users: users.concat(','),
      csrf: this.csrf,
      csrf_token: this.csrf
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })).data
  }

  async getWaitList (roomid) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/Lists', {
      params: {
        room_id: roomid
      }
    })).data
  }

  async pickUser (roomId, uid) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/PickUser', {
      params: {
        room_id: roomId,
        uid
      }
    })).data
  }

  // type=2 只拒绝， type=1 拒绝并封禁24小时，期间无法连麦
  async rejectUser (roomId, uid, type = 2, category = 1) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/Reject', {
      params: {
        room_id: roomId,
        uid,
        type,
        category
      }
    }))
  }

  async searchUser (searchUid, AnchorUid = this.uid) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/SearchUser', {
      params: {
        anchor_id: AnchorUid,
        uid: searchUid
      }
    })).data
  }

  async stop (roomId, voiceChannal) {
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/Stop', {
      params: {
        room_id: roomId,
        voice_channal: voiceChannal
      }
    })).data
  }

  async getDanmuConf (roomId, platform = 'pc', player = 'web') {
    return (await this.axios.get('/room/v1/Danmu/getConf', {
      params: {
        room_id: roomId,
        platform: platform,
        player
      }
    })).data
  }
}
