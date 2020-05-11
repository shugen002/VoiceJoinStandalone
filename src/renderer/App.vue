<template>
  <div
    id="app"
    class="container"
  >
    <Layout :style="{minHeight: '100vh'}">
      <Sider>
        <div class="sider-container">
          <div>
            <Menu
              :active-name="page"
              theme="dark"
              width="auto"
              :open-names="['1']"
              @on-select="onSelect"
            >
              <MenuItem name="home">
                <Icon type="md-home" />
                首页
              </MenuItem>
              <MenuItem name="live">
                <Icon type="md-play" />
                直播间设置
              </MenuItem>
              <MenuItem name="rules">
                <Icon type="md-construct" />
                参与条件
              </MenuItem>
              <MenuItem name="phone">
                <Icon type="md-call" />
                接线台
                <Badge :count="count"></Badge>
              </MenuItem>
              <MenuItem name="setting">
                <Icon type="md-settings" />
                设置
              </MenuItem>
              <MenuItem name="help">
                <Icon type="md-help" />
                帮助
              </MenuItem>
              <MenuItem v-if="showDevtool" name="debug">
                <Icon type="md-bug" />
                Debug
              </MenuItem>
            </Menu>
          </div>
          <div style="flex-grow:1" @click="devtool"></div>
          <!-- <div class="status-container">
            <div>头像</div><div>通话中 时长</div>
          </div> -->
        </div>
      </Sider>
      <Content :style="{backgroundColor:'rgb(245,247,249)',minHeight:'100vh',maxheight:'100vh'}">
        <RouterView />
      </Content>
    </Layout>
  </div>
</template>

<style>
div::-webkit-scrollbar {
  width: 8px;
}
div {
  scrollbar-width: thin;
}
div::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.432);
  border-radius: 4px;
}
.sider-container{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.status-container{
  align-self: flex-end;
  width: 100%;
  color: white;
  display: flex;
}
</style>

<script>
import AgoraMixin from './mixins/AgoraMixin'
import DanmakuMixin from './mixins/DanmakuMixin'

export default {
  mixins: [AgoraMixin, DanmakuMixin],
  data: function () {
    return {
      page: 'home',
      count: 0,
      time: [0, 0, 0, 0, 0],
      showDevtool: false
    }
  },
  danmaku: {
    VOICE_JOIN_ROOM_COUNT_INFO (msg) {
      if (msg.data && (msg.data.apply_count || msg.data.notify_count)) {
        this.count = msg.data.apply_count || msg.data.notify_count
      } else {
        this.count = 0
      }
    },
    VOICE_JOIN_STATUS (msg) {
      console.log(msg)
    }
  },
  agora: {
    connected () {
      this.$Message.success('已连接到服务器')
    },
    connectedToRemote () {
      this.$Message.success('通话已连接')
    },
    timeout () {
      this.$Message.error('连接超时或未知错误')
    },
    'peer-leave' () {
      this.$Message.info('对方已离开通话')
      this.$agora.leave()
    },
    disconnected () {
      this.$Message.info('通话结束')
    }
  },
  methods: {
    onSelect (name) {
      if (this.$route.name !== name) {
        this.$router.push(name)
      }
    },
    devtool () {
      this.time[0] = this.time[1]
      this.time[1] = this.time[2]
      this.time[2] = this.time[3]
      this.time[3] = this.time[4]
      this.time[4] = Date.now()
      if (this.time[4] - this.time[0] < 500) {
        this.showDevtool = true
      }
    }
  }
}
</script>
