<template>
  <div class="setting-container">
    <h1>设置</h1>
    <div>
      <h2>音频设备</h2>
      <Form>
        <FormItem label="音频输入设备">
          <Select v-model="audioInputDevice" style="width:200px" @on-change="sync">
            <Option v-for="item in audioInputDevices" :key="item.deviceId" :value="item.deviceId">
              {{ item.label!==""?item.label:item.deviceId }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="音频输出设备">
          <Select v-model="audioOutputDevice" style="width:200px" @on-change="sync">
            <Option v-for="item in audioOutputDevices" :key="item.deviceId" :value="item.deviceId">
              {{ item.label!==""?item.label:item.deviceId }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<style scoped>
.setting-container{
  margin: 16px;
}
</style>
<script>
export default {
  data: function () {
    return {
      audioInputDevices: [],
      audioOutputDevices: [],
      audioInputDevice: 'default',
      audioOutputDevice: 'default'
    }
  },
  created () {
    this.audioInputDevice = this.$agora.audioInputDevice
    this.audioOutputDevice = this.$agora.audioOutputDevice
    this.$agora.getDevices().then((e) => {
      this.audioInputDevices = e.filter((e) => { return e.kind === 'audioinput' })
      this.audioOutputDevices = e.filter((e) => { return e.kind === 'audiooutput' })
    })
  },
  methods: {
    sync () {
      this.$agora.audioInputDevice = this.audioInputDevice
      this.$agora.audioOutputDevices = this.audioOutputDevice
    }
  }
}
</script>
