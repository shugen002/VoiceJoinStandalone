export default {
  install (Vue) {
    Vue.prototype.$api = window._API
  }
}
