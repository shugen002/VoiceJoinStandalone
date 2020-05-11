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
                @on-change="setRoomSwitch"
              >
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
            </FormItem>
            <FormItem label="条件">
              <RadioGroup
                v-model="type"
                size="large"
                vertical
                @on-change="saveConfig"
              >
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
              <Select v-model="minGuardLevel" @on-change="saveConfig">
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
                @on-change="onMinMedalLevelChange"
              />
            </FormItem>
          </Form>
        </div>
      </i-col>
      <i-col span="12">
        <div v-if="type=='3'&&roomStatus">
          <Input
            v-model="addUserInput"
            search
            enter-button="添加"
            placeholder="用户UID"
            type="number"
            @on-enter="searchAndPickUp"
            @on-search="searchAndPickUp"
          />
          <Table
            height="220"
            :columns="userColumns"
            :data="users"
            size="small"
          >
            <template slot="uid" slot-scope="{ row }">
              <div style="margin:0 -8px">
                {{ row.uid }}
              </div>
            </template>
            <template slot="user" slot-scope="{ row }">
              <div class="user">
                <img
                  :src="row.head_pic"
                  referrerpolicy="no-referrer"
                  class="face"
                >
                <div>
                  <p><span>{{ row.name }}</span></p>
                  <p><span>UL {{ row.user_level }}</span> <span v-if="row.medal_name && row.medal_level">{{ row.medal_name }} {{ row.medal_level }}</span></p>
                </div>
              </div>
            </template>
            <template slot="action" slot-scope="{ row, index }">
              <Button type="error" size="small" @click="remove(index)">
                <Icon type="md-close" />
              </Button>
            </template>
          </Table>
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
.face{
  width: 32px;
  height: 32px;
  border-radius: 16px;
}
.user{
  display: flex;
  margin:0 -5px
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
      minMedalLevel: 1,
      type: '0',
      users: [],
      addUserInput: '',
      userColumns: [{
        title: 'UID',
        slot: 'uid',
        width: '100',
        align: 'center'
      },
      {
        title: '用户',
        slot: 'user'
      }, {
        title: '移除',
        slot: 'action',
        width: '64'
      }],
      possibleUsers: []
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$api.getInfo().then((res) => {
        if (res.code === 0) {
          this.isLogined = true
          this.roomId = res.data.room_id
          this.getRoomCan()
          this.syncConfig()
        } else {
          this.$Message.error('未登录或其他错误')
        }
      }).catch((err) => {
        this.$Message.error('未登录或其他错误')
        console.log(err)
      })
    },
    getRoomCan () {
      this.$api.getRoomCan(this.roomId).then((res) => {
        if (res.code === 0) {
          this.rootStatus = !!res.data.root_status
          this.roomStatus = !!res.data.room_status
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
        }
      })
    },
    searchUser (value) {
      this.$api.searchUser(value).then((res) => {
        if (res.code === 0) {
          this.possibleUsers = [res.data]
        }
      })
    },
    pickUp () {
      this.users.push(this.possibleUsers[0])
    },
    searchAndPickUp () {
      this.$api.searchUser(this.addUserInput).then((res) => {
        this.users.push(res.data)
        this.saveConfig()
      })
      this.addUserInput = ''
    },
    remove (index) {
      this.users.splice(index, 1)
      if (this.users.length <= 0) {
        this.$Message.warning('用户列表不能为空，无法保存')
      } else {
        this.saveConfig()
      }
    },
    setRoomSwitch (val) {
      this.$api.setRoomSwitch(this.roomId, val).then((res) => {
        if (res.code === 0) {
          this.$Message.success('成功')
        } else if (res.code !== undefined) {
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.$Message.error('切换房间开关失败：未知错误')
          console.log(res)
        }
        this.getRoomCan()
      }).catch((...args) => {
        this.$Message.error('未知错误')
        console.log(...args)
      })
    },
    saveConfig () {
      this.$api.setConfig(this.roomId, this.type, this.minGuardLevel, this.minMedalLevel, this.users.map((e) => { return e.uid }))
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('成功设置规则')
          } else if (res.code !== undefined) {
            this.$Message.error(`设置规则失败：${res.code}，${res.message || res.msg}`)
          } else {
            this.$Message.error('设置规则失败：未知错误')
            console.log(res)
          }
          this.syncConfig()
        })
    },
    onMinMedalLevelChange (val) {
      this.minMedalLevel = val
      this.saveConfig()
    }
  }
}
</script>
