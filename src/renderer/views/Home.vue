<template>
  <Layout>
    <Content :style="{padding: '16px'}">
      <div v-if="!isLogined">
        <Button @click="jumpLogin">
          登录
        </Button>
      </div>
      <div v-if="isLogined">
        <h1>当前用户信息</h1>
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
    </Content>
  </Layout>
</template>

<style scoped>

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
      this.$api.getUserInfo().then((data) => {
        if (data.code === 0) {
          this.isLogined = true
          this.face = data.data.userInfo.face
          this.username = data.data.userInfo.uname
          this.uid = data.data.userInfo.uid
          this.roomId = data.data.roomid
          this.$agora.uid = data.data.userInfo.uid
          this.$store.commit({ type: 'syncUserInfo', username: this.username, uid: this.uid, roomId: this.roomId, face: this.face })
          this.$danmaku.connect(this.roomId)
        } else {
          this.isLogined = false
        }
      }).catch((error) => {
        console.log(error)
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
