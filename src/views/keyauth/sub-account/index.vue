<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-card class="box-card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="userList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="用户名" prop="account" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" prop="account" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.department">{{ row.department.name }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.status.locked"><svg-icon icon-class="locked" /></span>
            <span v-else><svg-icon icon-class="normal" /></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-if="row.status.locked" type="primary" size="mini" @click="handleLock(row)">解冻</el-button>
            <el-button v-else type="warning" size="mini" @click="handleUnLock(row)">冻结</el-button>
            <el-button :loading="deleteLoading === row.account" size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getUserList" />
    </el-card>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="90px" style="margin-left: 40px; margin-right: 50px">
        <el-form-item label="部门" prop="department_id">
          <choice-department :department.sync="form.department_id" />
        </el-form-item>
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
</template>

<script>
import { createSubAccount, querySubAccount, deleteSubAccount } from '@/api/keyauth/subAccount'
import { queryDepartment } from '@/api/keyauth/department'
import Pagination from '@/components/Pagination'
import ChoiceDepartment from '@/components/ChoiceDepartment'

export default {
  name: 'SubAccount',
  components: { Pagination, ChoiceDepartment },
  data() {
    return {
      searchDepartmentLoading: false,
      departmentOptions: [],
      tableKey: 0,
      userList: null,
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20,
        with_department: true
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [{ required: true, message: '请输入用户名！', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码！', trigger: 'blur' }],
        department_id: [{ required: true, message: '请选择部门', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增用户' : '编辑用户'
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      // 获取用户列表
      querySubAccount(this.listQuery).then(response => {
        this.userList = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
    resetForm() {
      this.form = {
        account: '',
        status: 'published'
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
          this.createLoading = true
          if (this.dialogFormType === 'create') {
            this.createUser()
          } else {
            this.updateUser()
          }
        }
      })
    },
    createUser() {
      createSubAccount(this.form).then(resp => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.getUserList()
        this.createLoading = false
      }).catch(() => {
        this.createLoading = false
      })
    },
    updateUser() {

    },
    handleUpdate(row) {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, row) // copy obj
      this.form.timestamp = new Date(this.form.timestamp)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleLock(row) {
      // 冻结用户
    },
    handleUnLock(row) {
      // 解除冻结用户
    },
    handleDelete(row, index) {
      this.deleteLoading = row.account
      deleteSubAccount(row.account).then(resp => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getUserList()
        this.deleteLoading = ''
      }).catch(() => {
        this.deleteLoading = ''
      })
    },
    remoteSearchDepartment(keywords) {
      queryDepartment({ keywords }).then(resp => {
        this.departmentOptions = resp.data.items
      })
    }
  }

}
</script>
