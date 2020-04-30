export default {
  mounted () {
    const captcha = this.$options.captcha
    if (captcha) {
      this._captchaEventListener = {}
      Object.keys(captcha).forEach(event => {
        const func = captcha[event].bind(this)
        this.$captcha.event.on(event, func)
        this._captchaEventListener[event] = func
      })
    }
  },
  beforeDestroy () {
    if (this._captchaEventListener) {
      Object.keys(this._captchaEventListener).forEach(event => {
        this.$captcha.event.removeListener(event, this._captchaEventListener[event])
      })
    }
  }
}
