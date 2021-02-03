<template>
  <div class="wrapper">
    <treeselect
      v-model="value"
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

// We just use `setTimeout()` here to simulate an async operation
// instead of requesting a real API server for demo purpose.
const simulateAsyncOperation = fn => {
  setTimeout(fn, 2000)
}

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
      value: null,
      options: [],
      total: 0,
      props: {
        lazy: true,
        label: 'show',
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
              item.show = item.name + ' (' + item.manager + ')'
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
  },
  mounted() {
    this.queryRootDepartment()
  },
  methods: {
    queryRootDepartment() {
      listQuery.parent_id = ''
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
    loadOptions({ action, parentNode, callback }) {
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      console.log(parentNode)
      if (action === LOAD_CHILDREN_OPTIONS) {
        switch (parentNode.id) {
          case 'success': {
            simulateAsyncOperation(() => {
              parentNode.children = [{
                id: 'child',
                label: 'Child option',
                children: null
              }]
              callback()
            })
            break
          }
          case 'no-children': {
            simulateAsyncOperation(() => {
              parentNode.children = []
              callback()
            })
            break
          }
          case 'failure': {
            simulateAsyncOperation(() => {
              callback(new Error('Failed to load options: network error.'))
            })
            break
          }
          default: /* empty */
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
