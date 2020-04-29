
<template>
  <div class="container">
    <div class="grid">
      <div class="main">
        <Card style="height:100%">
          <div>
            <h3>房间标题</h3>
            <div class="form-item">
              <i-input v-model="title">
                <Button slot="append">
                  保存
                </Button>
              </i-input>
            </div>
          </div>

          <div>
            <h3>直播分类</h3>
            <div class="form-item">
              <Tabs v-model="currentTab" type="card" style="max-width:440px">
                <TabPane
                  v-for="parentAreaItem in areas"
                  :key="parentAreaItem.id"
                  :label="parentAreaItem.name"
                  :name="'area'+parentAreaItem.id"
                >
                  <div class="area-container">
                    <div v-for="areaItem in parentAreaItem.list" :key="areaItem.id" class="areaItem">
                      <Button
                        :type="isSelectedArea(areaItem.id)"
                        shape="circle"
                        size="small"
                        @click="switchArea(parentAreaItem.id,areaItem.id)"
                      >
                        {{ areaItem.name }}
                      </Button>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div v-if="tags.length>0">
            <h3>直播标签</h3>
            <div class="form-item">
              <div class="tag-container">
                <div v-for="tagItem in tags" :key="tagItem.id" class="tagItem">
                  <Button
                    :type="isSelectedTag(tagItem.id)"
                    shape="circle"
                    size="small"
                    @click="setTag(tagItem.id)"
                  >
                    {{ tagItem.name }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div class="button-container">
            <!-- TODO: 推流码 -->
            <Button v-if="liveStatus==1" @click="stopLive">
              停止直播
            </Button>
            <Button v-else @click="startLive">
              开始直播
            </Button>
          </div>
        </Card>
      </div>
      <div class="cover">
        <Card style="height:100%">
          <h3>直播封面</h3>
          To be done.
        </Card>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container{
  width: 100%;
  height: 100%;
  padding: 5px;
}
.grid{
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr ;
  column-gap: 5px;
  row-gap: 5px;
}
.form-item{
  padding: 5px;
}
.area-container{
  width: 100%;
  max-height: 150px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  justify-content: flex-start;
}
.areaItem{
  padding: 3px;
  flex-grow: 0;
}
.tag-container{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  justify-content: flex-start;
}
.tagItem{
  padding: 3px;
  flex-grow: 0;
}
.button-container{
  display: flex;
  justify-content: flex-end;
}
</style>
<script>
export default {
  data: function () {
    return {
      currentTab: 'area1',
      areas: [],
      tags: [],
      isLogined: false,
      roomId: 0,
      parentArea: 0,
      area: 0,
      lastSelectTag: 0,
      title: '',
      liveStatus: 0
    }
  },
  created () {
    this.getUserInfo()
    this.getAreaList()
  },
  methods: {
    getUserInfo () {
      this.$api.getInfo().then((res) => {
        if (res.code === 0) {
          console.log(res)
          this.isLogined = true
          this.roomId = res.data.room_id
          this.parentArea = res.data.parent_id
          this.area = res.data.area_v2_id
          this.title = res.data.title
          this.liveStatus = res.data.live_status
          this.currentTab = 'area' + this.parentArea
          this.getLiverCustomTags(this.area, this.parentArea)
        } else {
          this.$Message.error('未登录或其他错误')
          console.log(res)
        }
      }).catch((err) => {
        this.$Message.error('拉取用户信息失败：未知错误')
        console.log(err)
      })
    },
    getAreaList () {
      this.$api.getAreaList().then((res) => {
        if (res.code === 0 && res.data && res.data.length) {
          this.areas = res.data
        } else {
          this.$Message.error('拉取分区列表失败')
          console.error(res)
        }
      }).catch(err => {
        this.$Message.error('拉取分区列表失败')
        console.error(err)
      })
    },
    switchArea (parentId, areaId) {
      this.$api.updateRoomArea(this.roomId, parentId, areaId).then((res) => {
        if (res.code === 0) {
          this.$Message.success('切换分区成功')
          this.getUserInfo()
        } else if (res.code !== undefined) {
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.$Message.error('切换分区失败：未知错误')
          console.log(res)
        }
      }).catch((err) => {
        this.$Message.error('切换分区失败：未知错误')
        console.log(err)
      })
    },
    isSelectedArea (id) {
      return parseInt(id) === this.area ? 'primary' : 'default'
    },
    isSelectedTag (id) {
      return parseInt(id) === this.lastSelectTag ? 'primary' : 'default'
    },
    getLiverCustomTags (areaId, parentId) {
      this.$api.getLiverCustomTags(areaId, parentId).then((res) => {
        if (res.code === 0) {
          this.tags = res.data
          if (res.data.length === 0) {
            this.lastSelectTag = 0
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    setTag (id) {
      this.$api.setLiverCustomTags(this.roomId, id).then((res) => {
        if (res.code === 0) {
          this.lastSelectTag = parseInt(id)
        } else if (res.code !== undefined) {
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.$Message.error('设置标签失败：未知错误')
          console.log(res)
        }
      }).catch((err) => {
        this.$Message.error('设置标签失败：未知错误')
        console.log(err)
      })
    },
    startLive () {
      this.$api.startLive(this.roomId, this.area).then((res) => {
        this.getUserInfo()
        if (res.code === 0) {
          this.setTag(this.lastSelectTag)
          this.$Message.success('开播了，快干活')
          console.log(res)
        } else if (res.code !== undefined) {
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.$Message.error('开始直播失败：未知错误')
          console.log(res)
        }
      }).catch((err) => {
        this.$Message.error('开始直播失败：未知错误')
        console.log(err)
      })
    },
    stopLive () {
      this.$api.stopLive(this.roomId).then((res) => {
        this.getUserInfo()
        if (res.code === 0) {
          this.setTag(this.lastSelectTag)
          this.$Message.success('下播了，呼~')
          console.log(res)
        } else if (res.code !== undefined) {
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.$Message.error('停止直播失败：未知错误')
          console.log(res)
        }
      })
    },
    setRoomTitle () {
      this.$api.updateRoomTitle(this.roomId, this.title).then((res) => {
        this.getUserInfo()
        if (res.code === 0) {
          this.setTag(this.lastSelectTag)
          this.$Message.success('修改房间标题成功')
        } else if (res.code !== undefined) {
          this.$Message.error(`错误：${res.code}，${res.message || res.msg}`)
        } else {
          this.$Message.error('修改房间标题失败：未知错误')
          console.log(res)
        }
      }).catch((err) => {
        this.$Message.error('修改房间标题失败：未知错误')
        console.log(err)
      })
    }
  }
}
</script>
