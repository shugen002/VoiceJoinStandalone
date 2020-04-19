<template>
  <div class="container">
    <h1>参与条件</h1>
    <Form :label-width="80">
      <FormItem label="连麦开关">
        <i-switch
          v-model="roomStatus"
          size="large"
        >
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </FormItem>
    </Form>
    <Form :label-width="80" :disabled="!roomStatus">
      <FormItem label="条件">
        <RadioGroup v-model="type" size="large" vertical>
          <Radio label="0">
            关注即可
          </Radio>
          <Radio label="1">
            大航海等级
          </Radio>
          <Radio label="2">
            粉丝勋章等级
          </Radio>
          <Radio label="3">
            指定用户
          </Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div v-if="type=='1'&&roomStatus">
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
    </div>
    <div v-if="type=='2' &&roomStatus">
      <Slider
        :min="1"
        :max="20"
        :step="1"
        show-input
      />
    </div>
  </div>
</template>
<style scoped>
.container{
  margin:16px
}
</style>

<script>
export default {
  data () {
    return {
      roomStatus: false,
      minGuardLevel: 0,
      type: 0
    }
  },
  methods: {

  }
}
</script>
