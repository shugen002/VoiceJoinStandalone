<template>
  <div class="container">
    <h1>警告！</h1>
    <p>除了你信任的人以外，请不要听从任何人的指导打开开发者工具及进行任何操作。否则自行承担相应后果。</p>
    <p>
      <Checkbox v-model="iknow">
        我已充分了解可能带来的风险并会对我自己的账号安全负责的。
      </Checkbox>
    </p>
    <Button v-if="iknow" @click="onDev">
      开发者工具
    </Button>
  </div>
</template>

<style scoped>
.container{
  padding: 10px;
}
</style>

<script>
export default {
  data: function () {
    return {
      iknow: false
    }
  },
  methods: {
    onDev () {
      this.$api.devtool()
    }
  }
}
</script>
