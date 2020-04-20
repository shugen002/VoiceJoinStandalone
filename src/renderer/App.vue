<template>
  <div
    id="app"
    class="container"
  >
    <Layout :style="{minHeight: '100vh'}">
      <Sider>
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
          <MenuItem name="rules">
            <Icon type="md-construct" />
            参与条件
          </MenuItem>
          <MenuItem name="phone">
            <Icon type="md-call" />
            接线台
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
      </Sider>
      <Content :style="{backgroundColor:'rgb(245,247,249)',minHeight:'100vh',maxheight:'100vh'}">
        <RouterView />
      </Content>
    </Layout>
  </div>
</template>

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
  danmaku: {
  },
  methods: {
    onSelect (name) {
      this.$router.push(name)
    }
  }
}
</script>
