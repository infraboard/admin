<template>
  <el-drawer
    ref="drawer"
    title="新增用户"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="40%"
  >
    <div class="drawer-content">
      <el-form ref="userForm" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="部门" prop="department_id">
          <choice-department v-if="!departmentId" :department.sync="form.department_id" />
          <el-input v-else v-model="departmentName" disabled />
          <div class="input-tips">
            <span>用户归属的部门, 决定了用户可以看到的空间</span>
          </div>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
          <el-input v-model="form.account" maxlength="60" show-word-limit />
          <div class="input-tips">
            <span>用户登录时的用户名, 可以使用中文</span>
          </div>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" style="width:80%" show-password />
          <div class="fr" style="width:20%;display: inline-flex;">
            <el-button type="text" @click="generateRandomPass"> <svg-icon style="font-size: 18px;color: #13C2C2;margin-left:12px;" icon-class="random" /></el-button>
            <el-button v-clipboard:copy="form.password" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;font-size: 16px;" />
          </div>
          <div class="input-tips">
            <span>用户密码有强度校验,建议随机生成, 点击右边循环按钮</span>
          </div>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="profile.real_name">
          <el-input v-model="form.profile.real_name" maxlength="40" show-word-limit />
          <div class="input-tips">
            <span>用户真实姓名</span>
          </div>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="profile.nick_name">
          <el-input v-model="form.profile.nick_name" maxlength="40" show-word-limit />
          <div class="input-tips">
            <span>昵称, 伪装者使用</span>
          </div>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="profile.city">
          <el-input v-model="form.profile.city" maxlength="40" show-word-limit />
          <div class="input-tips">
            <span>所在城市</span>
          </div>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="profile.phone">
          <el-input v-model="form.profile.phone" maxlength="40" show-word-limit />
          <div class="input-tips">
            <span>用于收取验证码和重要提醒</span>
          </div>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="profile.email">
          <el-input v-model="form.profile.email" maxlength="60" show-word-limit />
          <div class="input-tips">
            <span>用于收取验证码和重要提醒</span>
          </div>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="profile.gender">
          <el-radio v-model="form.profile.gender" label="MALE">男</el-radio>
          <el-radio v-model="form.profile.gender" label="FEMALE">女</el-radio>
          <el-radio v-model="form.profile.gender" label="UNKNOWN">保密</el-radio>
        </el-form-item>
        <el-form-item label="过期时间" :label-width="formLabelWidth">
          <el-checkbox v-model="neverExpire">永不过期</el-checkbox>
          <div class="input-tips">
            <span>用户多少天之内未登录过系统的锁定时间, 防止僵尸用户带来的安全风险</span>
          </div>
        </el-form-item>
        <el-form-item v-show="!neverExpire" :label-width="formLabelWidth">
          <el-date-picker
            v-model="expireDatetime"
            style="width:100%"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 4}"
            maxlength="200"
            show-word-limit
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="createAccountLoading" @click="submit">{{ createAccountLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { createSubAccount, genRandomPassword } from '@/api/keyauth/subAccount'
import ChoiceDepartment from '@/components/ChoiceDepartment'
import { describeDepartment } from '@/api/keyauth/department'

import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'CreateAccountDrawer',
  components: { ChoiceDepartment },
  directives: {
    clipboard
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    departmentId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      departmentName: '',
      departmentQuery: {},
      queryDepartmentLoading: false,
      departmentList: [],
      table: false,
      dialog: false,
      createAccountLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一月',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '一年',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }]
      },
      neverExpire: true,
      expireDatetime: '',
      form: {
        department_id: '',
        account: '',
        expires_days: 90,
        password: '',
        description: '',
        profile: {
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
        }
      },
      formLabelWidth: '80px',
      rules: {
        account: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'change' }],
        'profile.phone': [{ required: true, message: '请输入用户电话号码', trigger: 'change' }],
        'profile.email': [{ required: true, message: '请输入用户邮箱', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialog = val
        if (val) {
          this.resetForm()
          this.form.department_id = this.departmentId
          this.describeDepartment()
          this.$nextTick(() => {
            this.$refs['userForm'].clearValidate()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    describeDepartment() {
      if (this.departmentId) {
        this.departmentName = '加载中 ...'
        describeDepartment(this.departmentId).then(resp => {
          this.departmentName = resp.data.name
        })
      }
    },
    handleClose(done) {
      if (this.createAccountLoading) {
        return
      }
      this.createAccountLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    cancelForm() {
      this.createAccountLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    async generateRandomPass() {
      var resp = await genRandomPassword({})
      this.form.password = resp.data.password
    },
    clipboardSuccess() {
      this.$notify({
        message: '复制成功',
        duration: 1500,
        customClass: 'notify-success'
      })
    },
    resetForm() {
      this.departmentName = ''
      this.form = {
        department_id: '',
        account: '',
        expires_days: 90,
        password: '',
        description: '',
        profile: {
          real_name: '',
          nick_name: '',
          phone: '',
          email: '',
          address: '',
          gender: 'UNKNOWN',
          avatar: '',
          language: '',
          city: ''
        }
      }
    },
    submit() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.createAccountLoading = true
          createSubAccount(this.form).then(resp => {
            this.$notify({
              message: `添加用户[${resp.data.account}]成功`,
              customClass: 'notify-success'
            })
            this.$refs.drawer.closeDrawer()
            this.$emit('update:visible', false)
            this.$emit('change', resp.data)
          }).finally(() => {
            this.createAccountLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.drawer-footer {
  text-align: center;
}

</style>>
