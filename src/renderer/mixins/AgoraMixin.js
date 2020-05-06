export default {
  mounted () {
    const AgoraController = this.$options.agora
    if (AgoraController) {
      this._agoraEventListener = {}
      Object.keys(AgoraController).forEach(event => {
        const func = AgoraController[event].bind(this)
        this.$agora.on(event, func)
        this._agoraEventListener[event] = func
      })
    }
  },
  beforeDestroy () {
    if (this._agoraEventListener) {
      Object.keys(this._agoraEventListener).forEach(event => {
        this.$agora.removeListener(event, this._agoraEventListener[event])
      })
    }
  }
}
