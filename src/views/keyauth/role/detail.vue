<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card f12">
        <el-row :gutter="8">
          <el-col :xs="12" :sm="12" :lg="12">
            <span class="title">角色信息</span>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-button class="fr" type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          </el-col>

        </el-row>
        <el-row :gutter="8" style="margin-bottom: 12px;">
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">名称: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.name }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">创建人: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.creater }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">创建时间: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="8" style="margin-bottom: 12px;">
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">角色类型: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.type }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">角色ID: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.id }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">更新时间: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="8" style="margin-bottom: 12px;">
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">角色描述: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ role.description }}</span>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="权限条目" name="first">
          {{ role.permissions }}
        </el-tab-pane>
        <el-tab-pane label="关联策略" name="second">
          <div>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">添加用户</el-button>
          </div>
          <div>
            <el-table
              :key="tableKey"
              v-loading="listLoading"
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

            <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getDepartmentList" /> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { descRole } from '@/api/keyauth/role'

export default {
  name: 'RoleDetail',
  directives: { },
  data() {
    return {
      tableKey: 0,
      role: {},
      total: 0,
      activeName: 'first',
      deleteLoading: false,
      queryloading: false,
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
  created() {
    this.getRole()
  },
  methods: {
    getRole() {
      this.queryloading = true
      // 获取用户列表
      descRole(this.$route.params.id).then(resp => {
        this.role = resp.data
        this.queryloading = false
      }).catch(() => {
        this.queryloading = false
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
    handleUpdate(row) {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
