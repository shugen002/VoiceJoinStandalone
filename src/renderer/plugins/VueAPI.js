import EventEmmitter from 'events'
export default {
  install (Vue) {
    Vue.prototype.$api = window._API
    Vue.prototype.$danmaku = window._Danmaku
    window._Danmaku.event = new EventEmmitter()
    window._Danmaku.onmessage = (...args) => {
      window._Danmaku.event.emit(...args)
    }
    Vue.prototype.$captcha = window._Captcha
    window._Captcha.event = new EventEmmitter()
    window._Captcha.onmessage = (...args) => {
      window._Captcha.event.emit(...args)
    }
  }
}
