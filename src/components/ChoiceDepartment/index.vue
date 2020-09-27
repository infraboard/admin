<template>
  <el-cascader v-model="currentdepartment" :props="props" style="width:100%" :show-all-levels="false" />
</template>

<script>
import { queryDepartment } from '@/api/keyauth/department'

const listQuery = { parent_id: '', with_sub_count: true, page_number: 1, page_size: 2000 }

export default {
  name: 'ChoiceDepartment',
  props: {
    department: {
      default: '',
      type: String
    },
    valueAttr: {
      default: 'id',
      type: String
    }
  },
  data() {
    return {
      total: 0,
      props: {
        lazy: true,
        label: 'name',
        value: this.$props.valueAttr,
        lazyLoad(node, resolve) {
          listQuery.parent_id = ''
          if (!node.root) {
            listQuery.parent_id = node.data.id
          }
          node.loading = true
          queryDepartment(listQuery).then(resp => {
            this.total = resp.data.total
            const list = []
            resp.data.items.forEach(item => {
              item.leaf = item.sub_count === 0
              list.push(item)
            })
            resolve(list)
            node.loading = false
          }).catch(() => {
            node.loading = false
          })
        }
      }
    }
  },
  computed: {
    currentdepartment: {
      get() {
        return this.department
      },
      set(val) {
        this.$emit('update:department', val[val.length - 1])
        this.$emit('change', val[val.length - 1])
      }
    }
  }
}
</script>

<style>

</style>
