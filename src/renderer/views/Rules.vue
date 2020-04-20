<template>
  <div class="container">
    <h1>参与条件</h1>
    <h3 v-if="!isLogined">
      您还没登录，前往首页登录
    </h3>
    <h3>当前房间 <span v-if="rootStatus" style="color:green">可以</span><span v-if="!rootStatus" style="color:red">不可以</span> 使用与观众连麦功能</h3>
    <Divider />
    <Row>
      <i-col span="12">
        <div class="rules">
          <Form :label-width="80" :disabled="!rootStatus">
            <FormItem label="连麦开关">
              <i-switch
                v-model="roomStatus"
                size="large"
              >
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
            </FormItem>
            <FormItem label="条件">
              <RadioGroup v-model="type" size="large" vertical>
                <Radio label="0" :disabled="!roomStatus">
                  关注即可
                </Radio>
                <Radio label="1" :disabled="!roomStatus">
                  大航海等级
                </Radio>
                <Radio label="2" :disabled="!roomStatus">
                  粉丝勋章等级
                </Radio>
                <Radio label="3" :disabled="!roomStatus">
                  指定用户
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if="type=='1'&&roomStatus" label="不小于">
              <Select v-model="minGuardLevel">
                <Option value="3">
                  舰长
                </Option>
                <Option value="2">
                  提督
                </Option>
                <Option value="1">
                  总督
                </Option>
              </Select>
            </FormItem>
            <FormItem v-if="type=='2' &&roomStatus" label="不小于">
              <Slider
                v-model="minMedalLevel"
                :min="1"
                :max="20"
                :step="1"
                show-input
              />
            </FormItem>
          </Form>
        </div>
      </i-col>
      <i-col span="12">
        <div>
          <AutoComplete v-model="addUserInput" placeholder="添加用户UID" />
          <Table height="200" :columns="userColumns" :data="users" />
        </div>
      </i-col>
    </Row>
  </div>
</template>
<style scoped>
.container{
  margin:16px
}
.rules{
  margin:4px;
}
</style>

<script>
export default {
  data () {
    return {
      isLogined: false,
      roomId: 0,
      rootStatus: false,
      roomStatus: false,
      minGuardLevel: '3',
      medaminMedalLevelStart: 1,
      type: '0',
      users: [],
      addUserInput: '',
      userColumns: [{
        title: 'UID',
        key: 'uid'
      }, { title: '用户名', key: 'name' }
      ]
    }
  },
  created () {
    this.isLogined = this.$store.state.App.isLogined
    if (this.isLogined) {
      this.roomId = this.$store.state.App.roomId
      this.getRoomCan()
      this.syncConfig()
    }
  },
  methods: {
    getRoomCan () {
      this.$api.getRoomCan(this.roomId).then((e) => {
        if (e.code === 0) {
          this.rootStatus = !!e.data.root_status
          this.roomStatus = !!e.data.room_status
        }
      })
    },
    syncConfig () {
      this.$api.getConfig(this.roomId).then((e) => {
        if (e.code === 0) {
          this.type = e.data.type + ''
          this.minGuardLevel = e.data.guard + ''
          this.minMedalLevel = e.data.medal_start
          this.users = e.data.users
          // console.log(e)
        }
      })
    }
  }
}
</script>
