<template>
  <div class="container">
    <div class="item">
      <div class="phone">
        <div class="background" :style="isJoined ? 'background-color:#387b4b;' : 'animation:ani-bg 100s infinite;'">
          <div style="filter: blur(180px);width:100%;height:100%;background-color:white;opacity:.35;"></div>
        </div>
        <div class="callui">
          <div class="status">
            <img :src="currentUser.head_pic" class="face" :style="isJoined ? '' : 'transform:scale(0,0);'">
            <p style="font-size:72px;letter-spacing:4px;">
              <!--TODO:Time-->
              {{ isJoined ? "0:00" : dateTime.time }}
            </p>
            <transition name="fade" mode="out-in">
              <p v-if="isJoined" key="isJoined" style="font-size:18px;">
                {{ currentUser.user_name }}
              </p>
              <p v-if="!isJoined" key="!isJoined" style="font-size:18px;">
                {{ dateTime.date }}
              </p>
            </transition>
            <transition name="fade">
              <p v-if="isJoined" style="font-size:12px;color:#a5ccb0;margin-top:12px;">
                通话中
              </p>
            </transition>
          </div>
          <div class="volctrl">
            <transition name="fade" mode="out-in" type="transition">
              <div v-if="isJoined" key="isJoined">
                <!--TODO:Volume Control-->
              </div>
              <div v-if="!isJoined" key="!isJoined" class="waiting">
                <p>选择通话以连接</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <Card>
        <h3 slot="title">
          等候列表
          <button @click="isJoined = !isJoined">
            现在{{ isJoined ? "连接" : "挂断" }}
          </button>
        </h3>
        <div style="height:438px;overflow:hidden auto;margin:-8px">
          <div v-for=" item in waitingList" :key="item.uid" class="user">
            <div class="user-info">
              <img :src="item.head_pic" class="face">
              <div class="user-base-info">
                <p><strong>{{ item.user_name }}</strong> </p>
                <p><span>UID:{{ item.uid }}</span></p>
                <p><span>UL {{ item.user_level }}</span> <span v-if="item.medal_name && item.medal_level">{{ item.medal_name }} {{ item.medal_level }}</span></p>
              </div>
              <div class="action">
                <Dropdown trigger="click" :transfer="true">
                  <Button shape="circle" icon="ios-more" />
                  <DropdownMenu slot="list">
                    <DropdownItem>拒接</DropdownItem>
                    <DropdownItem>封禁</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <!-- <Button shape="circle" icon="ios-more" /> -->
                <Button
                  type="success"
                  icon="md-call"
                  shape="circle"
                  size="large"
                  @click="connect(item)"
                />
              </div>
            </div>
            <Divider size="small" />
            <span>{{ item.user_msg }}</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
@keyframes ani-bg{
  0% { background-color: #172b58; }
  20% { background-color: #58173c; }
  40% { background-color: #175851; }
  60% { background-color: #17583d; }
  80% { background-color: #174158; }
  100% { background-color: #172b58; }
}
@keyframes ani-op{
  0% { opacity: .3; }
  50% { opacity: .3; }
  75% { opacity: .8; }
  100% { opacity: .3; }
}
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.container{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  height: 100%;
}
.item{
  padding: 5px;
}
.user-info{
  display: flex;
  width: 100%;
}
.face{
  flex-grow:0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  align-self: center;
  transition: transform 1s;
}
.user-base-info{
  flex-grow: 1;
  padding-left: 10px;
}
.action{
  flex-grow: 0;
  align-self: center;
}
.ivu-divider{
  margin: 2px;
}
.user{
  border: 1px solid rgb(218, 218, 218);
  padding: 5px;
  border-radius: 5px;
  margin: 2px;
}
.phone{
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid rgb(218, 218, 218);
  position: relative;
  color: white;
}
.phone > .background{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: #172b58;
  transition: background-color 1s;
}
.callui{
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}
.callui > .status{
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.callui > .volctrl{
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.callui > .volctrl > .waiting{
  animation: ani-op 5s infinite;
}
</style>

<script>
import AgoraMixin from '../mixins/AgoraMixin'
import DanmakuMixin from '../mixins/DanmakuMixin'

export default {
  mixins: [AgoraMixin, DanmakuMixin],
  data: function () {
    return {
      roomId: 0,
      uid: 0,
      waitingList: [
        {
          uid: 178820108,
          user_msg: '连麦嘛？很甜的那种。',
          create_at: 1587464335,
          user_name: '只是一个搬运工',
          head_pic: 'https://i2.hdslb.com/bfs/face/1e042bf1a74a46ecd2b9d87bebbdd8d9abc4fb25.jpg',
          user_level: 22,
          user_level_color: 5805790,
          guard: 0,
          medal_name: '',
          medal_color: 0,
          medal_level: 0,
          order: 0
        },
        {
          uid: 178820104,
          user_msg: '连麦嘛？很甜的那种。',
          create_at: 1587464335,
          user_name: '只是一个搬运工',
          head_pic: 'https://i2.hdslb.com/bfs/face/1e042bf1a74a46ecd2b9d87bebbdd8d9abc4fb25.jpg',
          user_level: 22,
          user_level_color: 5805790,
          guard: 0,
          medal_name: '',
          medal_color: 0,
          medal_level: 0,
          order: 0
        },
        {
          uid: 178820103,
          user_msg: '连麦嘛？很甜的那种。',
          create_at: 1587464335,
          user_name: '只是一个搬运工',
          head_pic: 'https://i2.hdslb.com/bfs/face/1e042bf1a74a46ecd2b9d87bebbdd8d9abc4fb25.jpg',
          user_level: 22,
          user_level_color: 5805790,
          guard: 0,
          medal_name: '',
          medal_color: 0,
          medal_level: 0,
          order: 0
        },
        {
          uid: 178820102,
          user_msg: '连麦嘛？很甜的那种。',
          create_at: 1587464335,
          user_name: '只是一个搬运工',
          head_pic: 'https://i2.hdslb.com/bfs/face/1e042bf1a74a46ecd2b9d87bebbdd8d9abc4fb25.jpg',
          user_level: 22,
          user_level_color: 5805790,
          guard: 0,
          medal_name: '',
          medal_color: 0,
          medal_level: 0,
          order: 0
        },
        {
          uid: 178820101,
          user_msg: '连麦嘛？很甜的那种。',
          create_at: 1587464335,
          user_name: '只是一个搬运工',
          head_pic: 'https://i2.hdslb.com/bfs/face/1e042bf1a74a46ecd2b9d87bebbdd8d9abc4fb25.jpg',
          user_level: 22,
          user_level_color: 5805790,
          guard: 0,
          medal_name: '',
          medal_color: 0,
          medal_level: 0,
          order: 0
        }],
      waitingListColumn: [
        {
          title: 'UID',
          slot: 'uid',
          width: '100',
          align: 'center'
        },
        {
          title: '用户',
          slot: 'user'
        }, {
          title: '操作',
          slot: 'action',
          width: '64'
        }],
      isJoined: false,
      currentUser: {
        uid: 178820108,
        start_at: 0,
        user_name: '只是一个搬运工',
        head_pic: 'https://i2.hdslb.com/bfs/face/1e042bf1a74a46ecd2b9d87bebbdd8d9abc4fb25.jpg',
        user_level: 22,
        user_level_color: 5805790,
        guard: 0,
        medal_name: '',
        medal_level: 0,
        medal_color: 0
      },
      dateTime: {
        date: '',
        time: ''
      },
      timer: null
    }
  },
  created () {
    this.isLogined = this.$store.state.App.isLogined
    if (this.isLogined) {
      this.roomId = this.$store.state.App.roomId
      this.uid = this.$store.state.App.uid
      this.getWaitList()
    }
    // Date&Time
    this.timer = setInterval(() => {
      const date = new Date()
      this.dateTime.date = `${date.getMonth() + 1}月${date.getDate()}日`
      this.dateTime.time = `${date.getHours()}:${date.getMinutes().toLocaleString('zh-cn', { minimumIntegerDigits: 2 })} `
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  danmaku: {
    VOICE_JOIN_LIST () {
      this.getWaitList()
    }
  },
  methods: {
    getWaitList () {
      this.$api.getWaitList(this.roomId).then((res) => {
        if (res.code === 0) {
          this.waitingList = res.data.list
          this.isJoined = !!res.data.status.status
          this.currentUser = res.data.status
        } else {
          this.$Message.error('拉取等候列表失败')
          console.log(res)
        }
      }).catch((e) => {
        this.$Message.error('拉取等候列表失败')
        console.log(e)
      })
    },
    connect (user) {
      this.$api.pickUser(this.roomId, user.uid).then((res) => {
        if (res.code === 0) {
          this.$agora.join(res.data.channel, this.uid + '', user.uid + '')
          this.getWaitList()
          console.log(res)
        } else {
          console.log(res)
        }
      })
    },
    reject (user) {
      this.$api.rejectUser(this.roomId, user.uid, 2).then((res) => {
        if (res.code === 0) {
          this.$Message.success('拒接成功')
          this.getWaitList()
        }
      })
    },
    ban (user) {

    },
    realBan (user) {
      this.$api.rejectUser(this.roomId, user.uid, 1).then((res) => {
        if (res.code === 0) {
          this.$Message.success('封禁成功，24小时内无法连麦')
          this.getWaitList()
        }
      })
    },
    leave () {
      this.$agora.leave()
    }

  }
}
</script>
