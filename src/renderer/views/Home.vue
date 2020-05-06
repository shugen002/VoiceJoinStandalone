<template>
  <div class="container">
    <div class="panel">
      <h3>当前用户信息</h3>
      <div v-if="!isLogined">
        <Button @click="jumpLogin">
          登录
        </Button>
      </div>
      <div v-if="isLogined">
        <p>
          <img
            :src="face"
            referrerpolicy="no-referrer"
          >
        </p>
        <p>用户名: {{ username }}</p>
        <p>UID: {{ uid }}</p>
        <p>房间号: {{ roomId }}</p>
      </div>
    </div>
    <div class="panel">
      <h2>关于</h2>
      <p>由于</p>
    </div>
  </div>
</template>

<style scoped>
.container{
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr;
}
.panel{
  padding: 5px;
}
</style>

<script>
export default {
  data () {
    return {
      isLogined: false,
      username: '',
      uid: 0,
      roomId: 0,
      face: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    jumpLogin () {
      this.$router.push('login')
    },
    getUserInfo () {
      this.$api.getInfo().then((res) => {
        if (res.code === 0) {
          this.isLogined = true
          this.face = res.data.face
          this.username = res.data.uname
          this.uid = res.data.uid
          this.roomId = res.data.room_id
          this.$agora.uid = res.data.uid
          this.$store.commit({ type: 'syncUserInfo', username: this.username, uid: this.uid, roomId: this.roomId, face: this.face })
          this.$danmaku.connect(this.roomId)
        } else if (res.code !== undefined) {
          this.isLogined = false
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.isLogined = false
          this.$Message.error('未知错误，请到控制台查看。')
          console.log(res)
        }
      }).catch((error) => {
        if (error.code === -2) {
          this.$Message.error('未知错误，请到控制台查看错误。')
        }
      })
    }
  }
}
</script>

<style>
.hero-body {
  height: 100vh;
}
</style>
