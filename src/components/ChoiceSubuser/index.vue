<template>
  <div class="wrapper">
    <el-select
      v-model="choicedUser"
      style="width:100%"
      filterable
      remote
      clearable
      reserve-keyword
      placeholder="请输入用户的用户名、邮箱或电话进行搜索"
      :remote-method="searchSubAccount"
      :loading="loading"
    >
      <el-option
        v-for="item in options"
        :key="item.account"
        :label="item.label"
        :value="item.account"
      />
    </el-select>
  </div>
</template>

<script>
import { querySubAccount } from '@/api/keyauth/subAccount'

export default {
  name: 'ChoiceSubuser',
  props: {
    user: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      loading: false,
      searchQuery: {
        keywords: ''
      },
      options: [],
      total: 0
    }
  },
  computed: {
    choicedUser: {
      get() {
        return this.user
      },
      set(val) {
        this.$emit('update:user', val)
        this.$emit('change', val)
      }
    }
  },
  mounted() {
  },
  methods: {
    async searchSubAccount(kw) {
      this.searchQuery.keywords = kw
      this.options = []
      const resp = await querySubAccount(this.searchQuery)
      this.total = resp.data.total
      resp.data.items.forEach(item => {
        item.label = item.account
        this.options.push(item)
      })
    }
  }
}
</script>

<style lang="scss">
</style>
