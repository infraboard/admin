<template>
  <div>
    <div>
      <el-button type="primary" size="mini" @click="handleCreate()">添加用户</el-button>
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

      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="90px" style="margin-left: 40px; margin-right: 50px">
          <el-form-item label="用户名" prop="account">
            <el-input v-model="form.account" maxlength="60" show-word-limit />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" :loading="createLoading" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { createSubAccount, querySubAccount } from '@/api/keyauth/subAccount'
import Pagination from '@/components/Pagination'

export default {
  name: 'DepartmentUser',
  components: { Pagination },
  directives: { },
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
        department_id: ''
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        department_id: '',
        account: '',
        password: ''
      },
      rules: {
        account: [{ required: true, message: '请输入用户名称!', trigger: 'change' }],
        password: [{ required: true, message: '请输入用户密码!', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增用户' : '编辑用户'
    },
    departmentId() {
      const query = this.$route.query
      if (query && query.id) {
        return query.id
      }
      return ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.listQuery.department_id = this.departmentId
        this.getDepartmentUser()
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    getDepartmentUser() {
      this.listUserLoading = true
      this.listQuery.department_id = this.departmentId
      querySubAccount(this.listQuery).then(resp => {
        this.currentUers = resp.data.items
        this.total = resp.data.total
        this.listUserLoading = false
      }).catch(() => {
        this.listUserLoading = false
      })
    },
    resetForm() {
      this.form = {
        department_id: '',
        account: '',
        password: ''
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
            this.createUser()
          } else {
            // 更新
          }
        }
      })
    },
    createUser() {
      this.createLoading = true
      // 创建请求
      this.form.department_id = this.departmentId
      console.log(this.form)
      createSubAccount(this.form).then(resp => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.getDepartmentUser()
        this.createLoading = false
      }).catch(() => {
        this.createLoading = false
      })
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
