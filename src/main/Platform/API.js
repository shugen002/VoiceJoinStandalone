import axios from 'axios'
import crypto from 'crypto'
import https from 'https'
import Consts from '../Consts'
import { app } from 'electron'

const appkey = '1d8b6e7d45233436'
const secret = '560c52ccd288fed045859ed18bffd973'
const platform = 'android'
const loginSecretkey = '60698ba2f68e01ce44738920a0ffe768'
const loginAppKey = 'bca7e84c2d947ac6'

export class API {
  constructor () {
    this.accessKey = ''
    this.buvid = RandomID(64)
    this.axios = axios.create({
      baseURL: 'https://api.live.bilibili.com',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 BiliDroid/5.58.0 (bbcallen@gmail.com) os/android model/Unknown mobi_app/android build/5580400 channel/master innerVer/5580400 osVer/9 network/2',
        'APP-KEY': 'android',
        Buvid: RandomID(37).toLocaleUpperCase(),
        env: 'prod'
      },
      httpsAgent: (Consts.isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined)
    })
    this.loginInfo = null
  }

  /**
   * 获取加密密钥
   */
  async getKey () {
    const data = {
    }
    return (await this.axios.post('https://passport.bilibili.com/api/oauth2/getKey',
      sign(data, loginAppKey, loginSecretkey, platform))).data
  }

  /**
   * 登录
   * @param {string} username 用户名(手机号、邮箱)
   * @param {string} password 密码
   * @param {string} pubkey pubkey
   * @param {string} hash hash
   */
  async login (username, password, pubkey, hash) {
    const data = {
      username,
      password: RSAPassword(password, pubkey, hash)
    }
    const loginRes = (await this.axios.post('https://passport.bilibili.com/api/v3/oauth2/login',
      sign(data, loginAppKey, loginSecretkey, platform))).data
    if (loginRes.code === 0) {
      this.loginInfo = loginRes.data
      this.accessKey = loginRes.data.token_info.access_token
    }
    return loginRes
  }

  /**
   * 获取用户直播信息
   */
  async getInfo () {
    if (this.loginInfo === null) {
      return { code: -101, message: '账号未登录', ttl: 1 }
    }
    const data = {
      access_key: this.accessKey,
      uId: this.loginInfo.token_info.mid
    }
    return (await this.axios.get('/xlive/app-blink/v1/room/GetInfo', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  /**
   * 拉取分区列表
   */
  async getAreaList () {
    const data = {
      access_key: this.accessKey
    }
    return (await this.axios.get('/room/v1/Area/getList', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  /**
   * 获取最近三个分区
   * @param {string|number} roomId 房间号
   */
  async getMyChooseArea (roomId) {
    const data = {
      access_key: this.accessKey,
      roomid: roomId
    }
    return (await this.axios.get('/room/v1/Area/getMyChooseArea', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  /**
   * 拉取封面列表
   * @param {string|number} roomId 房间号
   */
  async getCoverList (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.axios.get('/room/v1/Cover/get_list', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  /**
   * 设置封面
   * @param {string|number} roomId 房间号
   * @param {string|number} picId 封面图片id
   */
  async setCover (roomId, picId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      pic_id: picId
    }
    return (await this.axios.post('/room/v1/Cover/update',
      sign(data, appkey, secret, platform))).data
  }

  async getLiverCustomTags (areaId, parentAreaId) {
    const data = {
      access_key: this.accessKey,
      area_id: areaId,
      parent_area_id: parentAreaId
    }
    return (await this.axios.get('/room/v3/Area/getLiverCustomTags', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async setLiverCustomTags (roomId, tagId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      tag_id: tagId
    }
    return (await this.axios.get('/room/v3/Area/setLiverCustomTag', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  /**
   * 更新房间信息
   * @param {object} data 数据
   */
  async updateRoomInfo (data) {
    data.access_key = this.accessKey
    return (await this.axios.post('/room/v1/Room/update', sign(data, appkey, secret, platform)
    )).data
  }

  async updateRoomTitle (roomId, title) {
    return this.updateRoomInfo({
      room_id: roomId,
      title
    })
  }

  async updateRoomArea (roomId, parentAreaId, areaId) {
    return this.updateRoomInfo({
      parent_area_id: parentAreaId,
      room_id: roomId,
      area_id: areaId
    })
  }

  async startLive (roomId, areaId, type = 1) {
    const data = {
      access_key: this.accessKey,
      area_v2: areaId,
      room_id: roomId,
      type
    }
    return (await this.axios.post('/room/v1/Room/startLive', sign(data, appkey, secret, platform))).data
  }

  async stopLive (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.axios.post('/room/v1/Room/stopLive', sign(data, appkey, secret, platform))).data
  }

  async getRoomCan (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/RoomCan', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async setRoomSwitch (roomId, status) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      status: typeof status === 'number' ? status : (status ? 1 : 0)
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/RoomSwitch', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async getConfig (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/getConfig', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async setConfig (roomId, type, guard, medalStart, users = []) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      type,
      guard,
      medal_start: medalStart,
      users: users.concat(',')
    }
    return (await this.axios.post('/av/v1/VoiceJoinAnchor/setConfig',
      sign(data, appkey, secret, platform))).data
  }

  async getWaitList (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/Lists', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async pickUser (roomId, uid) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      uid
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/PickUser', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  // type=2 只拒绝， type=1 拒绝并封禁24小时，期间无法连麦
  async rejectUser (roomId, uid, type = 2, category = 1) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      uid,
      type,
      category
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/Reject', {
      params: sign(data, appkey, secret, platform)
    }))
  }

  async searchUser (searchUid, AnchorUid) {
    const data = {
      access_key: this.accessKey,
      anchor_id: AnchorUid,
      uid: searchUid
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/SearchUser', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async stopVoiceJoin (roomId, voiceChannal) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      voice_channal: voiceChannal
    }
    return (await this.axios.get('/av/v1/VoiceJoinAnchor/Stop', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async getDanmuConf (roomId, platform = 'pc', player = 'web') {
    const data = {
      access_key: this.accessKey,
      room_id: roomId,
      platform: platform,
      player
    }
    return (await this.axios.get('/room/v1/Danmu/getConf', {
      params: sign(data, appkey, secret, platform)
    })).data
  }

  async getStream (roomId) {
    const data = {
      access_key: this.accessKey,
      room_id: roomId
    }
    return (await this.axios.get('/live_stream/v1/StreamList/get_stream_by_roomId', {
      params: sign(data, appkey, secret, platform)
    })).data
  }
}

function RandomID (length) {
  const words = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let randomID = ''
  randomID += words[Math.floor(Math.random() * 61) + 1]
  for (let i = 0; i < length - 1; i++) randomID += words[Math.floor(Math.random() * 62)]
  return randomID
}
function ts () {
  return parseInt(Date.now() / 1000)
}
/**
 * 签名
 * @param {Object} data 数据
 * @param {string} appkey key
 * @param {string} secret secret
 * @param {string} platform 平台
 */
function sign (data, appkey, secret, platform) {
  data.appkey = appkey
  data.platform = platform
  data.ts = ts()
  const item = Object.keys(data).sort().map((key) => {
    return key + '=' + stringify(data[key])
  }).join('&')
  data.sign = crypto.createHash('md5').update(item + secret).digest('hex')
  const finalData = {}
  if (data.password) {
    data.password = decodeURIComponent(data.password)
  }
  Object.keys(data).sort().forEach((key) => {
    finalData[key] = data[key]
  })
  return new URLSearchParams(finalData)
}
function stringify (item) {
  switch (typeof item) {
    case 'string':
      return item
    case 'function':
      throw new Error('Function?')
    case 'undefined':
      return ''
    default:
      return JSON.stringify(item)
  }
}
/**
 * RSA加密密码
 * @param {string} password 密码
 * @param {string} pubkey 公钥
 * @param {string} hash HASH
 */
function RSAPassword (password, pubkey, hash) {
  const padding = {
    key: pubkey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }
  const data = hash + password
  const encrypt = crypto.publicEncrypt(padding, Buffer.from(data)).toString('base64')
  return encodeURIComponent(encrypt)
}
