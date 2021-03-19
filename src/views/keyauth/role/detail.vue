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

        <el-row>
          <!-- 第一列 -->
          <el-col :xs="18" :sm="18" :lg="8">
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
          <!-- 第二列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">创建人</span>
              <span class="attr-value">{{ role.creater }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">角色ID</span>
              <span class="attr-value">{{ role.id }}</span>
            </el-row>
          </el-col>
          <!-- 第三列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">创建时间</span>
              <span class="attr-value">{{ role.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">更新时间</span>
              <span class="attr-value">{{ role.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane lazy label="权限条目" name="first">
          <role-permission :id="queryTimestamp" :permissions="role.permissions" />
        </el-tab-pane>
        <el-tab-pane lazy label="关联策略" name="second">
          <role-policy :role-id="role.id" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { descRole } from '@/api/keyauth/role'
import RolePolicy from './components/RolePolicy'
import RolePermission from './components/RolePermission'

export default {
  name: 'RoleDetail',
  components: { RolePolicy, RolePermission },
  directives: { },
  data() {
    return {
      tableKey: 0,
      queryloading: {},
      queryTimestamp: 0,
      role: {},
      activeName: 'first',
      deleteLoading: false,
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
  },
  methods: {
    getRole() {
      this.queryLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        target: '.app-main',
        body: true
      })
      // 获取用户列表
      descRole(this.$route.params.id).then(resp => {
        this.role = resp.data
        this.queryTimestamp = new Date().getTime()
      }).finally(() => {
        this.queryLoading.close()
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
