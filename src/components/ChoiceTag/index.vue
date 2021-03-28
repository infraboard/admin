<template>
  <div class="wrapper">
    <el-select
      v-model="choicedKey"
      style="width:38%"
      filterable
      remote
      clearable
      reserve-keyword
      placeholder="标签值"
      :remote-method="searchTagKey"
      :loading="loading"
    >
      <el-option
        v-for="item in keyOptions"
        :key="item.id"
        :label="`${item.key_label}(${item.key_name})`"
        :value="item.key_name"
      />
    </el-select>
    <el-select
      v-if="tagKey"
      v-model="choicedValue"
      style="margin-left:4px;width:60%"
      filterable
      multiple
      remote
      clearable
      reserve-keyword
      placeholder="标签值"
      :remote-method="searchTagValue"
      :loading="loading"
    >
      <el-option
        v-for="item in valueOptions"
        :key="item.id"
        :label="`${item.value.label}(${item.value.value})`"
        :value="item.value.value"
      />
    </el-select>
  </div>
</template>

<script>
import { queryTag, queryTagValue } from '@/api/keyauth/tag'

export default {
  name: 'ChoiceTag',
  props: {
    tagKey: {
      default: '',
      type: String
    },
    tagValues: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      searchKeyQuery: {
        keywords: ''
      },
      searchValueQuery: {
        keywords: ''
      },
      keyOptions: [],
      valueOptions: [],
      total: 0
    }
  },
  computed: {
    choicedKey: {
      get() {
        return this.tagKey
      },
      set(val) {
        this.$emit('update:tagKey', val)
        this.$emit('change', val)
        this.searchTagValue()
      }
    },
    choicedValue: {
      get() {
        return this.tagValues
      },
      set(val) {
        this.$emit('update:tagValues', val)
        this.$emit('change', val)
      }
    }
  },
  mounted() {
    this.searchTagKey()
  },
  methods: {
    async searchTagKey(kw) {
      this.searchKeyQuery.keywords = kw
      this.keyOptions = []
      const resp = await queryTag(this.searchKeyQuery)
      this.total = resp.data.total
      resp.data.items.forEach(item => {
        this.keyOptions.push(item)
      })
    },
    async searchTagValue(kw) {
      this.searchValueQuery.keywords = kw
      this.valueOptions = []
      const resp = await queryTagValue(this.tagKey, this.searchValueQuery)
      this.total = resp.data.total
      resp.data.items.forEach(item => {
        this.valueOptions.push(item)
      })
    }
  }
}
</script>

<style lang="scss">
</style>
