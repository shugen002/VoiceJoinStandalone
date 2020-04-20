<template>
  <webview
    ref="webview"
    :src="loginURL"
    style="min-height:100vh"
  />
</template>
<script>
export default {
  data: function () {
    return {
      loginURL: 'https://passport.bilibili.com/ajax/miniLogin/minilogin'
    }
  },
  created () {
    this.$nextTick(() => {
      this.$refs.webview.addEventListener('will-navigate', () => {
        this.$refs.webview.getWebContents().session.cookies.get({ url: 'https://www.bilibili.com' }).then(cookies => {
          const csrf = cookies.find((e) => { return e.name === 'bili_jct' }).value
          const uid = cookies.find((e) => { return e.name === 'DedeUserID' }).value
          this.$api.setCookies(cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';'), csrf, uid).then(console.log)
          this.$router.push('home')
        }).catch((err) => {
          console.log(err)
        })
      })
    })
  }
}
</script>
