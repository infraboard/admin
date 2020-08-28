<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="roleList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="角色名" prop="name" align="center" min-width="110">
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
          <span>{{ row.permissions.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center" min-width="220">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getRoleList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px" style="margin-left: 50px; margin-right: 50px">
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
import { queryRole, createRole } from '@/api/keyauth/role'
import Pagination from '@/components/Pagination'

export default {
  name: 'RoleList',
  components: { Pagination },
  directives: { },
  data() {
    return {
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
            this.createRole()
          } else {
            // 更新
          }
        }
      })
    },
    createRole() {
      this.createLoading = true
      // 创建请求
      createRole(this.form).then(resp => {
        this.dialogFormVisible = false
        this.roleList.unshift(resp.data)
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
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
      // deleteSubAccount(row.id).then(resp => {
      //   this.$notify({
      //     title: '成功',
      //     message: '删除成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   this.roleList.splice(index, 1)
      //   this.deleteLoading = ''
      // }).catch(() => {
      //   this.deleteLoading = ''
      // })
    }
  }
}
</script>
