<template>
  <el-drawer
    ref="drawer"
    :title="title"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="42%"
  >
    <div class="drawer-content">
      <div class="box-shadow">
        <json-editor ref="jsonEditor" v-model="event" />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import JsonEditor from './json.vue'

export default {
  name: 'EventShowDrawer',
  components: { JsonEditor },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '查看事件',
      type: String
    },
    event: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialog = val
      },
      immediate: true
    }
  },
  methods: {
    handleClose(done) {
      this.dialog = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>

.drawer-footer {
  text-align: center;
}

</style>
