<template>
  <div v-if="!hidden" class="el-alert tips is-light" style="margin-bottom: 10px;border-radius: 0px;">
    <div class="tips-icon">
      <svg-icon icon-class="tip" />
    </div>
    <div class="el-alert__content tips-content">
      <span class="el-alert__title is-bold">温馨提示</span>
      <li v-for="(item, i) in tips" :key="i" class="el-alert__description">{{ item }}</li>
      <i class="el-alert__closebtn el-icon-close" @click="handleClose" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tips',
  props: {
    tips: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      hidden: false
    }
  },
  methods: {
    handleClose() {
      this.hidden = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
    background-color: #e7f9f9;
    color: #1E9393;
}
.tips-icon {
    opacity: 1;
    position: absolute;
    top: 12px;
    left: 12px;
}

.tips-content {
    margin-left: 12px;
    margin-top: 3px;
}
</style>
