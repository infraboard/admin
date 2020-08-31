<template>
  <div>
    <div>
      <el-button type="primary" size="mini" @click="handleUpdate(row)">添加用户</el-button>
    </div>
    <div>
      <el-table
        :key="tableKey"
        v-loading="listUserLoading"
        :data="currentUers"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top:12px;"
      >
        <el-table-column label="名称" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="text" @click="handleDelete(row,$index)">
              迁移部门
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getDepartmentUser" />
    </div>
  </div>
</template>

<script>
import { querySubAccount } from '@/api/keyauth/subAccount'
import Pagination from '@/components/Pagination'

export default {
  name: 'DepartmentList',
  components: { Pagination },
  directives: { },
  props: {
    departmentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentUers: [],
      tableKey: 0,
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listUserLoading: false,
      listQuery: {
        page_number: 1,
        page_size: 20,
        parent_id: ''
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        name: '',
        parent_id: '',
        manager: ''
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称!', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增部门' : '编辑部门'
    }
  },
  created() {
  },
  methods: {
    getDepartmentUser() {
      this.listUserLoading = true
      querySubAccount({ department_id: this.departmentId }).then(resp => {
        this.currentUers = resp.data.items
        this.listUserLoading = false
      }).catch(() => {
        this.listUserLoading = false
      })
    },
    resetForm() {
      this.form = {
        name: '',
        description: ''
      }
    },
    handleCreate() {
      this.dialogFormType = 'create'
      this.resetForm()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogFormType === 'create') {
            // 新建
            this.createDepartment()
          } else {
            // 更新
          }
        }
      })
    },
    createDepartment() {
      this.createLoading = true
      // 创建请求
    //   createDepartment(this.form).then(resp => {
    //     this.dialogFormVisible = false
    //     this.departmentList.unshift(resp.data)
    //     this.$notify({
    //       title: '成功',
    //       message: '创建成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //     this.createLoading = false
    //   }).catch(() => {
    //     this.createLoading = false
    //   })
    },
    handleUpdate(row) {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.deleteLoading = row.name
    //   deleteDepartment(row.id).then(resp => {
    //     this.$notify({
    //       title: '成功',
    //       message: '删除成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //     this.departmentList.splice(index, 1)
    //     this.deleteLoading = ''
    //   }).catch(() => {
    //     this.deleteLoading = ''
    //   })
    }
  }
}
</script>

<style>

</style>
