<template>
  <Button @click="onDev">
    开发人员工具台
  </Button>
</template>

<script>
export default {
  methods: {
    onDev () {
      this.$api.devtool()
    }
  }
}
</script>
