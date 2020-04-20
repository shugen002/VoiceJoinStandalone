import EventEmmitter from 'events'
export default {
  install (Vue) {
    Vue.prototype.$api = window._API
    Vue.prototype.$danmaku = window._Danmaku
    window._Danmaku.event = new EventEmmitter()
    window._Danmaku.onmessage = (...args) => {
      window._Danmaku.event.emit(...args)
    }
  }
}
