<template>
  <el-cascader v-model="currentDepartmentId" :props="props" :show-all-levels="false" style="width:100%" />
</template>

<script>
import { queryDepartment } from '@/api/keyauth/department'

const listQuery = { parent_id: '', page_number: 1, page_size: 2000 }

export default {
  name: 'ChoiceDepartment',
  props: {
    departmentId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      total: 0,
      props: {
        lazy: true,
        label: 'name',
        value: 'id',
        lazyLoad(node, resolve) {
          if (!node.root) {
            listQuery.parent_id = node.data.id
          }

          node.loading = true
          queryDepartment(listQuery).then(resp => {
            this.total = resp.data.total
            resolve(resp.data.items)
            node.loading = false
          }).catch(() => {
            node.loading = false
          })
        }
      }
    }
  },
  computed: {
    currentDepartmentId: {
      get() {
        return this.departmentId
      },
      set(val) {
        this.$emit('update:departmentId', val[val.length - 1])
      }
    }
  }
}
</script>

<style>

</style>
