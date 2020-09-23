<template>
  <div class="app-container">
    <div>
      <el-card class="box-card f12">
        <el-row :gutter="8">
          <el-col :xs="12" :sm="12" :lg="12">
            <span class="title">角色信息</span>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-button class="fr" type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          </el-col>

        </el-row>
        <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">名称</span>
            <span class="attr-value">{{ role.name }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">角色类型</span>
            <span class="attr-value">{{ role.type }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">角色描述</span>
            <span class="attr-value">{{ role.description }}</span>
          </el-row>
        </el-col>
        <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">创建人</span>
            <span class="attr-value">{{ role.creater }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">角色ID</span>
            <span class="attr-value">{{ role.id }}</span>
          </el-row>
        </el-col>
        <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">创建时间</span>
            <span class="attr-value">{{ role.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">更新时间</span>
            <span class="attr-value">{{ role.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-row>
        </el-col>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="权限条目" name="first">
          <role-permission :permissions="role.permissions" />
        </el-tab-pane>
        <el-tab-pane label="关联策略" lazy name="second">
          <role-policy :role_id="role.id" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { descRole } from '@/api/keyauth/role'
import { queryPolicy } from '@/api/keyauth/policy'
import RolePolicy from './components/RolePolicy'
import RolePermission from './components/RolePermission'

export default {
  name: 'RoleDetail',
  components: { RolePolicy, RolePermission },
  directives: { },
  data() {
    return {
      tableKey: 0,
      role: {},
      activeName: 'first',
      deleteLoading: false,
      queryloading: false,
      dialogFormVisible: false,
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
    this.getRolePolicy()
  },
  methods: {
    getRole() {
      this.queryloading = true
      // 获取用户列表
      descRole(this.$route.params.id, { with_permissions: true }).then(resp => {
        this.role = resp.data
        this.queryloading = false
      }).catch(() => {
        this.queryloading = false
      })
    },
    getRolePolicy() {
      this.listPolicyLoading = true
      queryPolicy(this.listPolicyQuery).then(resp => {
        this.policys = resp.data.items
        this.total = resp.data.total
        this.listPolicyLoading = false
      }).catch(() => {
        this.listPolicyLoading = false
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
