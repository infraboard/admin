<template>
  <div class="app-container">
    <div class="title-row">
      <!-- 左侧box -->
      <div class="detail-left">
        <el-card class="box-card f12">
          <el-row :gutter="8">
            <el-col :xs="12" :sm="12" :lg="12">
              <span class="title">用户详情</span>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12">
              <div v-show="isEdit" class="fr">
                <el-button type="text" :loading="saveLoading" size="mini" @click="save">保存</el-button>
                <el-button type="text" size="mini" @click="cancel">取消</el-button>
              </div>
              <div v-show="!isEdit">
                <el-button class="fr" type="text" size="mini" @click="handleUpdate()">编辑</el-button>
              </div>
            </el-col>
          </el-row>
          <el-col class="detail-col" :xs="18" :sm="18" :lg="12">
            <el-row class="attr-row">
              <span class="attr-key">账号</span>
              <span class="attr-value">{{ user.account }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">头像</span>
              <div class="attr-value">
                <span v-if="user.profile">{{ user.profile.avatar }}</span>
                <span v-else>上传</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">性别</span>
              <div class="attr-value">
                <div v-show="isEdit">
                  <el-radio v-model="form.gender" label="MALE">男</el-radio>
                  <el-radio v-model="form.gender" label="FEMALE">女</el-radio>
                  <el-radio v-model="form.gender" label="UNKNOWN">保密</el-radio>
                </div>
                <div v-show="!isEdit">
                  <span v-if="user.profile">{{ user.profile.gender }}</span>
                  <span v-else>保密</span>
                </div>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">昵称</span>
              <div class="attr-value">
                <el-input v-show="isEdit" v-model="form.nick_name" maxlength="20" show-word-limit placeholder="用户昵称" />
                <span v-show="!isEdit">{{ user.profile.nick_name }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">姓名</span>
              <div class="attr-value">
                <el-input v-show="isEdit" v-model="form.real_name" maxlength="20" show-word-limit placeholder="真实姓名" />
                <span v-show="!isEdit">{{ user.profile.real_name }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">电话</span>
              <div class="attr-value">
                <el-input v-show="isEdit" v-model="form.phone" maxlength="20" show-word-limit placeholder="电话号码" />
                <span v-show="!isEdit">{{ user.profile.phone }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">邮箱</span>
              <div class="attr-value">
                <el-input v-show="isEdit" v-model="form.email" maxlength="20" show-word-limit placeholder="邮箱地址" />
                <span v-show="!isEdit">{{ user.profile.email }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">城市</span>
              <div class="attr-value">
                <el-input v-show="isEdit" v-model="form.city" maxlength="10" show-word-limit placeholder="省" />
                <span v-show="!isEdit">{{ user.profile.city }}</span>
              </div>
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
      <!-- 右侧box -->
      <el-card class="box-card f12 detail-right" :style="rightStyle">
        <el-row :gutter="8">
          <span class="title">快捷操作</span>
        </el-row>
        <el-row :gutter="8" style="margin-top:8px;">
          <el-button style="margin-left:22px;">修改密码</el-button>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane lazy label="访问策略" name="first">
          <user-policy :account="account" />
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
import { describeSubAccount, updateSubAccount } from '@/api/keyauth/subAccount'
import UserPolicy from './components/UserPolicy'

export default {
  name: 'SubAccountDetail',
  components: { UserPolicy },
  directives: { },
  data() {
    return {
      saveLoading: false,
      isEdit: false,
      activeName: 'first',
      tableKey: 0,
      queryLoading: {},
      user: {},
      createLoading: false,
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        real_name: '',
        nick_name: '',
        phone: '',
        email: '',
        address: '',
        gender: 'UNKNOWN',
        avatar: '',
        language: '',
        city: '',
        province: ''
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
  methods: {
    getSubAccountDetail() {
      this.queryLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        target: '.app-main',
        body: true
      })
      // 获取用户列表
      this.listPolicyQuery
      describeSubAccount(this.account).then(resp => {
        this.user = resp.data
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
    handleUpdate() {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, this.user.profile) // copy obj
      this.isEdit = true
    },
    save() {
      this.saveLoading = true
      console.log(this.form)
      updateSubAccount(this.account, this.form).then(resp => {
        this.user = resp.data
        this.saveLoading = false
        this.isEdit = false
      }).catch(() => {
      }).finally(() => {
        this.saveLoading = false
      })
    },
    cancel() {
      this.isEdit = false
    }
  }

}
</script>

<style lang="scss" scoped>
.title-row {
  display: -webkit-box;
}
.detail-left {
  width: 74%;
}
.detail-right {
  margin-left: 1%;
  width: 25%;
  border: 1px solid #e6ebf5;
}

.full-width {
  width: 330px;
}

</style>
