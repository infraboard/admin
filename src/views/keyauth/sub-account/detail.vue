<template>
  <div class="app-container">
    <div class="title-row">
      <div id="left" class="detail-left">
        <el-card class="box-card f12">
          <el-row :gutter="8">
            <el-col :xs="12" :sm="12" :lg="12">
              <span class="title">用户详情</span>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12">
              <el-button class="fr" type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
            </el-col>
          </el-row>
          <el-col class="detail-col" :xs="18" :sm="18" :lg="12">
            <el-row class="attr-row">
              <span class="attr-key">名称</span>
              <span class="attr-value">{{ user.account }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">性别</span>
              <div class="attr-value">
                <span v-if="user.gender">{{ user.gender }}</span>
                <span v-else> 未知 </span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">头像</span>
              <div class="attr-value">
                <span v-if="user.avatar">{{ user.avatar }}</span>
                <span v-else> 上传 </span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">昵称</span>
              <div class="attr-value">
                <span>{{ user.nick_name }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">姓名</span>
              <div class="attr-value">
                <span>{{ user.real_name }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">电话</span>
              <span class="attr-value">{{ user.mobile }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">邮箱</span>
              <span class="attr-value">{{ user.email }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">城市</span>
              <span class="attr-value">{{ user.province }} {{ user.city }}</span>
            </el-row>
          </el-col>
          <el-col :offset="2" class="detail-col" :xs="18" :sm="18" :lg="10">
            <el-row class="attr-row">
              <span class="attr-key">类型</span>
              <div class="attr-value">
                <span>{{ user.type }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">状态</span>
              <span v-if="user.status" class="attr-value">{{ user.status.locked }}</span>
              <span v-else>未知</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">部门</span>
              <span class="attr-value">{{ user.department_id }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">过期时间</span>
              <span v-if="user.expires_days" class="attr-value">{{ user.expires_days }}</span>
              <span v-else class="attr-value">永不过期</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">创建时间</span>
              <span class="attr-value">{{ user.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">更新时间</span>
              <span class="attr-value">{{ user.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
          </el-col>
        </el-card>
      </div>
      <div id="right" class="detail-right">
        <el-card class="box-card f12" :style="rightStyle">
          <el-row :gutter="8">
            <span class="title">快捷操作</span>
          </el-row>
          <el-row :gutter="8" style="margin-top:8px;">
            <el-button style="margin-left:22px;">修改密码</el-button>
          </el-row>
        </el-card>
      </div>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="访问策略" name="first">
          <user-policy :namespace-id="account" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px" style="margin-left: 50px; margin-right: 50px">
        <el-form-item label="名称" prop="name">
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
import { describeSubAccount } from '@/api/keyauth/subAccount'
import UserPolicy from './components/UserPolicy'

export default {
  name: 'SubAccountDetail',
  components: { UserPolicy },
  directives: { },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      user: {},
      createLoading: false,
      queryLoading: true,
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称!', trigger: 'change' }]
      },
      rightStyle: {
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增空间' : '编辑空间'
    },
    account() {
      return this.$route.params.account
    }
  },
  created() {
    this.getSubAccountDetail()
  },
  mounted() {
    this.rightStyle.height = this.adjustHeight()
  },
  methods: {
    adjustHeight() {
      var left = document.getElementById('left')
      var right = document.getElementById('right')
      if (left && right) {
        if (left.offsetHeight >= right.offsetHeight) {
          return left.offsetHeight + 'px'
        }
        return right.offsetHeight + 'px'
      }
    },
    getSubAccountDetail() {
      this.queryLoading = true
      // 获取用户列表
      this.listPolicyQuery
      describeSubAccount(this.account).then(resp => {
        this.user = resp.data
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
            this.createNamespace()
          } else {
            // 更新
          }
        }
      })
    },
    createNamespace() {
      this.createLoading = true
      // 创建请求
      // createNamespace(this.form).then(resp => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.title-row {
  display: flex;
}
.detail-left {
  width: 74%;
}
.detail-right {
  margin-left: 1%;
  width: 25%
}
</style>
