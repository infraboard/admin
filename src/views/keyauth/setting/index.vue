<template>
  <div class="app-container">
    <div>
      <el-card class="box-card f12">
        <el-row :gutter="8">
          <el-col :xs="12" :sm="12" :lg="12">
            <span class="title">域信息</span>
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
            <span v-if="domain.display_name">{{ domain.display_name }}</span>
            <span>{{ domain.name }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">管理员: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ domain.owner }}</span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">创建时间: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ domain.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="8" style="margin-bottom: 12px;">
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">LOGO: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span v-if="domain.logo">{{ domain.logo }}</span>
            <span v-else> 上传 </span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">状态: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span v-if="domain.enabled"><svg-icon icon-class="normal" /></span>
            <span v-else><svg-icon icon-class="locked" /></span>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">更新时间: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ domain.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="8" style="margin-bottom: 12px;">
          <el-col :xs="6" :sm="6" :lg="2">
            <span class="attr-key">空间描述: </span>
          </el-col>
          <el-col :xs="18" :sm="18" :lg="6">
            <span>{{ domain.description }}</span>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录安全" name="first">
          <user-setting />
        </el-tab-pane>
        <el-tab-pane lazy label="LDAP设置" name="second">
          <ldap-setting />
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import { getMyDomain } from '@/api/keyauth/profile'
import LdapSetting from './components/LdapSetting'
import UserSetting from './components/UserSetting'

export default {
  name: 'DomainSetting',
  components: { LdapSetting, UserSetting },
  directives: { },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      domain: {},
      endpoints: [],
      total: 0,
      queryLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增服务' : '编辑服务'
    },
    serviceName() {
      return this.$route.params.id
    }
  },
  created() {
    this.getServiceDetail()
  },
  methods: {
    getServiceDetail() {
      this.queryLoading = true
      // 获取用户列表
      getMyDomain().then(resp => {
        this.domain = resp.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
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
            this.createService()
          } else {
            // 更新
          }
        }
      })
    },
    createService() {
      this.createLoading = true
      // 创建请求
      // createService(this.form).then(resp => {
      //   this.dialogFormVisible = false
      //   this.roleList.unshift(resp.data)
      //   this.$notify({
      //     title: '成功',
      //     message: '创建成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   this.createLoading = false
      // }).catch(() => {
      //   this.createLoading = false
      // })
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
      // deleteService(row.id).then(resp => {
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
