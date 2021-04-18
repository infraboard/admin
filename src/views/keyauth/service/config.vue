<template>
  <div class="app-container">
    <div>
      <tips :tips="tips" />
    </div>
  </div>
</template>

<script>
import { queryService, deleteService } from '@/api/keyauth/service'
import Tips from '@/components/Tips'

const tips = [
  '微服务的配置, 敬请期待'
]

export default {
  name: 'ServiceConfig',
  components: { Tips },
  directives: { },
  data() {
    return {
      tips,
      filterKey: 'account',
      filterValue: '',
      tableKey: 0,
      roleList: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称!', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增服务' : '编辑服务'
    }
  },
  created() {
    this.getServiceList()
  },
  methods: {
    getServiceList() {
      this.listLoading = true
      // 获取用户列表
      queryService(this.listQuery).then(response => {
        this.roleList = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    updateServiceList() {
      this.getServiceList()
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.deleteLoading = row.name
      deleteService(row.id).then(resp => {
        this.$notify({
          message: `删除服务[${row.name}]成功`,
          customClass: 'notify-success'
        })
        this.getServiceList()
        this.deleteLoading = ''
      }).catch(() => {
        this.deleteLoading = ''
      })
    },
    clearSearch() {

    },
    updateUser() {

    }
  }
}
</script>

<style lang="scss" scoped>
.mall-actions {
  margin-left: 12px;
}

.app-container ::v-deep .el-select {
  width: 102px;
}
.app-container ::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
