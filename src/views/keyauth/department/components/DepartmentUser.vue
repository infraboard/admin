<template>
  <div class="container-wrapper">
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="用户名称" value="account" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreatePolicy()">添加用户</el-button>
      </div>
    </div>
    <div>
      <el-table
        :key="tableKey"
        v-loading="listUserLoading"
        :data="currentUers"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="用户名称" prop="name" align="center" min-width="110">
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
            <el-button v-show="deleteLoading !== row.account" size="mini" type="text" @click="handleDelete(row,$index)">
              迁移部门
            </el-button>
            <choice-department v-if="deleteLoading === row.account" :key="row.account" :department.sync="form.department_id" @change="departmentChanged" />
            <el-button v-show="deleteLoading === row.account" size="mini" type="text" @click="handleCancel(row)">
              取消
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
import { createSubAccount, querySubAccount, updateSubAccount } from '@/api/keyauth/subAccount'
import Pagination from '@/components/Pagination'
import ChoiceDepartment from '@/components/ChoiceDepartment'

export default {
  name: 'DepartmentUser',
  components: { Pagination, ChoiceDepartment },
  directives: { },
  props: {
    departmentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      filterKey: 'account',
      filterValue: '',
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
    }
  },
  watch: {
    departmentId: {
      handler: function(did) {
        if (did) {
          this.listQuery.department_id = this.departmentId
          this.getDepartmentUser()
          this.updateURL()
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    updateURL() {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query.id = this.departmentId
      this.$router.push({ path: this.$route.path, query })
    },
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
    departmentChanged() {
      if (this.form.department_id !== this.departmentId && this.deleteLoading !== '') {
        updateSubAccount(this.deleteLoading, { department_id: this.form.department_id }).then(resp => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.currentUers.splice(0, 1)
          this.deleteLoading = ''
        }).catch(() => {
          this.deleteLoading = ''
        })
      }
    },
    handleDelete(row, index) {
      this.deleteLoading = row.account
      this.form.department_id = row.department_id
    },
    handleCancel(row) {
      this.deleteLoading = ''
    },
    clearSearch() {

    },
    updateUser() {

    }
  }
}
</script>

<style lang="scss" scoped>
.container-wrapper ::v-deep .el-select {
  width: 102px;
}

.container-wrapper ::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
