<template>
  <div class="container">
    <div class="log">
      <p v-for="(item,i) in logs" :key="i">
        {{ item }}
      </p>
    </div>
    <div class="login-box">
      <Card>
        <p slot="title">
          登录
        </p>
        <div class="form">
          <div class="form-item">
            <i-input v-model="username" :disabled="loading" placeholder="用户名/邮箱/手机号">
              <Icon slot="prepend" type="md-person" />
            </i-input>
          </div>
          <div class="form-item">
            <i-input
              v-model="password"
              type="password"
              password:disabled="loading"
              placeholder="密码"
              @on-enter="login"
            >
              <Icon slot="prepend" type="md-lock" />
            </i-input>
          </div>
          <div class="form-item">
            <Button
              type="primary"
              :loading="loading"
              long
              @click="login"
            >
              登录
            </Button>
          </div>
        </div>
      </Card>
    </div>
    <Modal
      v-model="verification"
      width="280"
      :closable="false"
      :footer-hide="true"
    >
      <webview
        ref="webview"
        style="height:250px;width:250px"
        :src="geetest"
      />
    </Modal>
  </div>
</template>
<style scoped>
.container{
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.login-box{
  flex:1;
  max-width: 400px;
}
.form-item{
  padding: 5px;
}
.log{
  position: absolute;
  top: 0;
  left: 200px;
  padding: 5px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
}

</style>
<script>
import CaptchaMixin from '../mixins/CaptchaMixin'
export default {
  mixins: [CaptchaMixin],
  data: function () {
    return {
      username: '',
      password: '',
      geetest: '',
      logs: [],
      loading: false,
      verification: false
    }
  },
  captcha: {
    postMessage (id, item, ...args) {
      if (item && item.method) {
        switch (item.method) {
          case 'global.getAllSupport':
            this.$captcha.send(id, JSON.parse(item.data).callbackId, ['secure.captcha', 'secure.closeCaptcha', 'secure.imageCaptcha', 'global.import', 'global.getAllSupport'])
            break
          case 'secure.captcha':
            var data = JSON.parse(item.data)
            this.login(true, data.challenge, data.seccode, data.validate)
            this.verification = false
            break
          case 'secure.closeCaptcha':
            this.verification = false
            break
          default:
            break
        }
      }
    }
  },
  methods: {
    login (afterkey = false, challenge, seccode, validate) {
      this.loading = true
      this.appendLogs('拉取密钥')
      this.$api.getKey().then((res) => {
        if (res.code === 0 && res.data.hash && res.data.key) {
          this.appendLogs('拉取密钥成功')
          this.appendLogs('发送登录请求')
          var args = [this.username, this.password, res.data.key, res.data.hash]
          if (afterkey) {
            args.push(challenge, seccode, validate)
          }
          this.$api.login(...args)
            .then((res) => {
              if (res.code === 0) {
                this.appendLogs('登录成功')
                this.$Message.success('登录成功')
                this.$router.push('home')
              } else if (res.code === -105) {
                this.loading = false
                this.appendLogs('需要验证码')
                this.verification = true
                this.geetest = res.data.url
              } else if (res.code !== undefined) {
                this.errorCodeHandle(res)
              } else {
                this.errorHandle(res)
              }
            }).catch(this.errorHandle)
        } else if (res.code !== undefined) {
          this.errorCodeHandle(res)
        } else {
          this.errorHandle(res)
        }
      }).catch(this.errorHandle)
    },
    appendLogs () {
      this.logs.unshift(...arguments)
    },
    errorHandle (...args) {
      this.loading = false
      this.appendLogs('未知错误，请到控制台查看。')
      this.$Message.error('未知错误')
      console.log(...args)
    },
    errorCodeHandle (res) {
      this.loading = false
      this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
      this.appendLogs(`错误：${res.code}，${res.message || res.msg}`)
      console.log(res)
    }
  }
}
</script>
