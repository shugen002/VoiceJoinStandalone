<template>
  <div
    id="app"
    class="container"
  >
    <Layout :style="{minHeight: '100vh'}">
      <Sider>
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
              直播
            </MenuItem>
            <MenuItem name="rules">
              <Icon type="md-construct" />
              参与条件
            </MenuItem>
            <MenuItem name="phone">
              <Icon type="md-call" />
              接线台
              <Badge :count="10"></Badge>
            </MenuItem>
            <MenuItem name="setting">
              <Icon type="md-settings" />
              设置
            </MenuItem>
            <MenuItem name="help">
              <Icon type="md-help" />
              帮助
            </MenuItem>
            <MenuItem name="debug">
              <Icon type="md-bug" />
              Debug
            </MenuItem>
          </Menu>
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
</style>

<script>
import AgoraMixin from './mixins/AgoraMixin'
import DanmakuMixin from './mixins/DanmakuMixin'

export default {
  mixins: [AgoraMixin, DanmakuMixin],
  data: function () {
    return {
      page: 'home'
    }
  },
  captcha: {
    postMessage (...args) {
      console.log(...args)
    }
  },
  methods: {
    onSelect (name) {
      this.$router.push(name)
    }
  }
}
</script>
