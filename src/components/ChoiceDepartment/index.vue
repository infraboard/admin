<template>
  <div class="wrapper">
    <treeselect
      v-model="currentdepartment"
      :multiple="false"
      :options="options"
      :load-options="loadOptions"
      placeholder=""
    />
  </div>
</template>

<script>
import { queryDepartment } from '@/api/keyauth/department'

const listQuery = { parent_id: '', with_sub_count: true, page_number: 1, page_size: 2000 }

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

export default {
  name: 'ChoiceDepartment',
  components: { Treeselect },
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
      options: [],
      total: 0
    }
  },
  computed: {
    currentdepartment: {
      get() {
        console.log(this.department)
        if (this.department === '') {
          return null
        }
        return this.department
      },
      set(val) {
        console.log(val)
        this.$emit('update:department', val)
        this.$emit('change', val)
      }
    }
  },
  mounted() {
    this.queryRootDepartment()
  },
  methods: {
    queryRootDepartment() {
      listQuery.parent_id = '.'
      queryDepartment(listQuery).then(resp => {
        this.total = resp.data.total
        resp.data.items.forEach(item => {
          item.label = item.name + ' (' + item.manager + ')'
          if (item.sub_count !== 0) {
            item.children = null
          }
          this.options.push(item)
        })
      })
    },
    async loadOptions({ action, parentNode, callback }) {
      console.log(parentNode)
      parentNode.children = []
      if (action === LOAD_CHILDREN_OPTIONS) {
        try {
          listQuery.parent_id = parentNode.id
          const resp = await queryDepartment(listQuery)
          this.total = resp.data.total
          const children = []
          resp.data.items.forEach(item => {
            item.label = item.name + ' (' + item.manager + ')'
            if (item.sub_count !== 0) {
              item.children = null
            }
            parentNode.children.push(item)
            children.push(item)
          })
        } catch (error) {
          console.log(error)
          callback(new Error(`Failed to load options: ${error}`))
        }
      }
    }
  }
}
</script>

<style lang="scss">
.vue-treeselect__control {
  border-radius: 0px;
}
.el-form-item__content {
  font-size: 12px;
  color: #606266;
}
</style>
