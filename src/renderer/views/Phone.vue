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
              {{ isJoined ? deltaTime : dateTime.time }}
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
            <transition name="fade">
              <div v-if="isJoined" class="end-button" @click="leave">
                <i
                  class="ivu-icon ivu-icon-md-call"
                  style="transform:rotate(135deg);font-size:40px"
                ></i>
              </div>
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
                <Dropdown trigger="click" :transfer="true" @on-click="select($event,item)">
                  <Button shape="circle" icon="ios-more" />
                  <DropdownMenu slot="list">
                    <DropdownItem name="space">
                      个人空间
                    </DropdownItem>
                    <DropdownItem divided name="reject">
                      拒接
                    </DropdownItem>
                    <DropdownItem name="ban">
                      封禁
                    </DropdownItem>
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
    <Modal v-model="banModal" title="封禁？" @on-ok="realBan">
      <p>你真的要封禁这个用户吗？封禁后24小时内他(/她/它/牠<span v-if="false">/&#34421;</span>)将无法申请与你连麦。</p>
      <div class="user-info">
        <img :src="banUser.head_pic" class="face">
        <div class="user-base-info">
          <p><strong>{{ banUser.user_name }}</strong> </p>
          <p><span>UID:{{ banUser.uid }}</span></p>
          <p><span>UL {{ banUser.user_level }}</span> <span v-if="banUser.medal_name && banUser.medal_level">{{ banUser.medal_name }} {{ banUser.medal_level }}</span></p>
        </div>
      </div>
    </Modal>
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
.callui > .status > .end-button{
  padding: 10px;
  background-color: #aa0000;
  border-radius: 50%;
}
.callui > .status > .end-button:hover{
  background-color: #cc0000;
}
</style>

<script>
import AgoraMixin from '../mixins/AgoraMixin'
import DanmakuMixin from '../mixins/DanmakuMixin'

export default {
  mixins: [AgoraMixin, DanmakuMixin],
  data: function () {
    return {
      status: 0, // 0 等待 1 通话中 2 拨号中
      roomId: 0,
      uid: 0,
      waitingList: [],
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
        uid: 0,
        start_at: 0,
        user_name: '',
        head_pic: '',
        user_level: 0,
        user_level_color: 0,
        guard: 0,
        medal_name: '',
        medal_level: 0,
        medal_color: 0
      },
      dateTime: {
        date: '',
        time: ''
      },
      timer: null,
      deltaTime: '0:00',
      offset: 0,
      banModal: false,
      banUser: {}
    }
  },
  watch: {
    isJoined () {
      this.isJoined ? this.timeUpdate() : this.callTimeUpdate()
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
    this.timeUpdate()
    this.timer = setInterval(() => {
      this.isJoined ? this.callTimeUpdate() : this.timeUpdate()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  danmaku: {
    VOICE_JOIN_LIST () {
      this.getWaitList()
    },
    VOICE_JOIN_STATUS () {
      this.getWaitList()
    }
  },
  agora: {

  },
  methods: {
    getWaitList () {
      this.$api.getWaitList(this.roomId).then((res) => {
        if (res.code === 0) {
          this.waitingList = res.data.list
          this.isJoined = !!res.data.status.status
          this.currentUser = res.data.status
          if (this.isJoined) {
            if (this.callTimer === null) {
              this.offset = res.data.status.current_time - Date.now() / 1000
              // callTimer = setInterval()
            }
          }
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
      this.banUser = user
      this.banModal = true
    },
    realBan () {
      this.$api.rejectUser(this.roomId, this.banUser.uid, 1).then((res) => {
        if (res.code === 0) {
          this.$Message.success('封禁成功，24小时内无法与你连麦')
          this.getWaitList()
        }
      })
    },
    leave () {
      this.$api.stopVoiceJoin(this.roomId, this.$agora.currentChannel)
      this.$agora.leave()
    },
    timeUpdate () {
      const date = new Date()
      this.dateTime.date = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      this.dateTime.time = `${date.getHours()}:${date.getMinutes().toLocaleString('zh-cn', { minimumIntegerDigits: 2 })} `
    },
    callTimeUpdate () {
      var second = parseInt(Date.now() / 1000 - this.offset - this.currentUser.start_at)
      this.deltaTime = second > 3600 ? `${parseInt(second / 3600)}:${parseInt(second % 3600 / 60)}:${second % 60}` : `${parseInt(second % 3600 / 60)}:${second % 60}`
    },
    select (action, target) {
      switch (action) {
        case 'ban':
          this.ban(target)
          break
        case 'reject':
          this.reject(target)
          break
        case 'space':
          this.$api.openExternal(`https://space.bilibili.com/${target.uid}`)
          break
        default:
          break
      }
    }
  }
}
</script>
