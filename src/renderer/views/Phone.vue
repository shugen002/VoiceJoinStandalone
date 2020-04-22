<template>
  <Row>
    <i-col span="12">
      <div>
        <p>状态：{{ isJoined }}</p>
        <p>{{ currentUser.uid }}</p>
        <p>{{ currentUser.start_at }}</p>
        <p>{{ currentUser.user_name }}</p>
        <p>{{ currentUser.head_pic }}</p>
        <p>{{ currentUser.user_level }}</p>
        <p>{{ currentUser.user_level_color }}</p>
        <p>{{ currentUser.guard }}</p>
        <p>{{ currentUser.medal_name }}</p>
        <p>{{ currentUser.medal_level }}</p>
        <p>{{ currentUser.medal_color }}</p>
        <Button @click="getWaitList" />
      </div>
    </i-col>
    <i-col span="12">
      <div style="padding:5px">
        <Card>
          <h3 slot="title">
            等候列表
          </h3>
          <div style=" height:410px;overflow-y:auto">
            <div v-for=" item in waitingList" :key="item.uid">
              <Card>
                <div style="margin:-10px;overflow:hidden">
                  <div class="user">
                    <img :src="item.head_pic" class="face">
                    <div class="user-info">
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
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </i-col>
  </Row>
</template>

<style scoped>
.user{
  display: flex;
  width: 100%;
}
.face{
  flex-grow:0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  align-self: center;
}
.user-info{
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
</style>

<script>
export default {
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
      }
    }
  },
  created () {
    this.isLogined = this.$store.state.App.isLogined
    if (this.isLogined) {
      this.roomId = this.$store.state.App.roomId
      this.uid = this.$store.state.App.uid
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
      this.$api.rejectUser(this.roomId, user.uid, 1), then((res) => {
        if (res.code === 0) {
          this.$Message.success('封禁成功，24小时内无法连麦')
          this.getWaitList()
        }
      })
    },
    stop () {

    },
    realBan (user) {

    }

  }
}
</script>
