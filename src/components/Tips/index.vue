<template>
  <div v-if="!hidden" class="el-alert is-light" :style="style">
    <div class="tips-icon">
      <svg-icon :icon-class="iconClass" />
    </div>
    <div class="el-alert__content tips-content">
      <span class="el-alert__title is-bold">{{ title }}</span>
      <li v-for="(item, i) in tips" :key="i" class="el-alert__description tip-item">{{ item }}</li>
      <i class="el-alert__closebtn el-icon-close" @click="handleClose" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tips',
  props: {
    type: {
      type: String,
      default: 'info'
    },
    tips: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: '温馨提示'
    }
  },
  data() {
    return {
      hidden: false
    }
  },
  computed: {
    iconClass() {
      switch (this.type) {
        case 'info':
          return 'tip'
        case 'warn':
          return 'warnning'
        default:
          return 'tip'
      }
    },
    style() {
      const style = {
        marginBottom: '10px',
        borderRadius: '0px',
        backgroundColor: 'rgb(48 210 190 / 42%)',
        color: 'rgb(20 105 105)'
      }
      switch (this.type) {
        case 'warn':
          style.color = '#a04200'
          style.backgroundColor = '#ffdeaa'
      }
      return style
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

.tip-item {
  margin-top: 8px;;
}

</style>
