<template>
  <div class="app-container">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="角色名称" value="account" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreate">
          新建角色
        </el-button>
      </div>
    </div>

    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="roleList"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          type="selection"
          width="45"
          align="center"
        />
        <el-table-column label="角色名称" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <router-link :to="'/permission/role/'+row.id" class="link-type">
              <span>{{ row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.creater }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限条目数" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" min-width="220">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="230">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-divider v-if="row.type !== 'build_in'" direction="vertical" />
            <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="text" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getRoleList" />
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="90px" style="margin-left: 50px; margin-right: 50px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" />
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
import { queryRole, createRole, deleteRole } from '@/api/keyauth/role'
import Pagination from '@/components/Pagination'
import Tips from '@/components/Tips'

const tips = [
  '角色负责控制用户访问的功能, 比如能否创建资源A, 能否删除资源A'
]

export default {
  name: 'RoleList',
  components: { Pagination, Tips },
  directives: { },
  data() {
    return {
      filterKey: 'account',
      filterValue: '',
      tips,
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
      return this.dialogFormType === 'create' ? '新增角色' : '编辑角色'
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      // 获取用户列表
      queryRole(this.listQuery).then(response => {
        this.roleList = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    resetForm() {
      this.form = {
        name: '',
        description: ''
      }
    },
    handleCreate() {
      // 调转到角色创建页面
      this.$router.push({ path: '/permission/create-role' })
    },
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogFormType === 'create') {
            this.createRole()
          } else {
            // 更新
          }
        }
      })
    },
    async createRole() {
      this.createLoading = true
      // 创建请求
      try {
        var resp = await createRole(this.form)
        this.dialogFormVisible = false
        this.getRoleList()
        this.$message({
          message: `创建角色${resp.name}成功`,
          type: 'success'
        })
      } finally {
        this.createLoading = false
      }
    },
    handleUpdate(row) {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleDelete(row, index) {
      this.deleteLoading = row.name

      try {
        await deleteRole(row.id)
        this.getRoleList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } finally {
        this.deleteLoading = ''
      }
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
