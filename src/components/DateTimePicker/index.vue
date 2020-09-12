<template>
  <div class="block">
    <el-date-picker
      v-model="currentChoicedTime"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy-MM-dd HH:mm"
      :default-time="['00:00:00', '23:59:59']"
      align="right"
      style="width: 330px;"
    />
  </div>
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: {
    choicedTime: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: ''
    }
  },
  computed: {
    currentChoicedTime: {
      get() {
        return this.choicedTime
      },
      set(val) {
        this.$emit('update:choicedTime', val)
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style>

</style>
