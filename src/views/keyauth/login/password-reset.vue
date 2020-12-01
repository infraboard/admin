<template>
  <div class="app-container">
    <tips :tips="tips" />
    <div style="padding-top:22px;">
      <el-card class="center">
        <el-form ref="setPassForm" label-position="top" :rules="rules" label-width="80px" :model="form">
          <el-form-item label="">
            <span class="title">重置密码</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span class="account">{{ form.account }}</span>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pass">
            <el-input v-model="form.new_pass" style="width:100%" show-password />
            <div class="input-tips">
              <span>为了保证账号安全, 请确保新密码的复杂度</span>
            </div>
          </el-form-item>
          <el-form-item label="确认新密码" prop="repeateInput">
            <el-input v-model="form.repeateInput" show-password />
          </el-form-item>
        </el-form>
        <div class="form-footer">
          <el-button type="primary" :loading="resetPasswordLoading" @click="submit">{{ resetPasswordLoading ? '提交中 ...' : '确定重置' }}</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Tips from '@/components/Tips'
import { updatePassword } from '@/api/keyauth/profile'

const Base64 = require('js-base64').Base64

export default {
  name: 'PasswordReset',
  components: { Tips },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback('请再次输入新密码确认')
      } else if (value !== this.form.new_pass) {
        callback(new Error('二次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tips: ['你当前密码已经过期, 为了保障账户资产安全, 请重置密码'],
      rules: {
        new_pass: [{ required: true, trigger: 'change', message: '请输入新密码!' }],
        repeateInput: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      form: {
        account: '',
        old_pass: '',
        new_pass: '',
        repeateInput: ''
      },
      resetPasswordLoading: false
    }
  },
  mounted() {
    // 从cookie中获取登录页面传递过来的敏感信息
    this.form.account = this.$store.getters.account
    this.form.old_pass = Base64.decode(Cookies.get('password'))
    if (this.$store.getters.resetReason !== '') {
      this.tips = [this.$store.getters.resetReason]
    }
  },
  methods: {
    submit() {
      this.$refs['setPassForm'].validate((valid) => {
        if (valid) {
          this.resetPasswordLoading = true
          updatePassword(this.form).then(resp => {
            // 重置完成跳转到登录页面重新登录
            this.$router.push({ path: '/login' })
          }).finally(() => {
            this.resetPasswordLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  width: 40%;
  height: 480px;
  margin: auto;
  border-radius: 8px;
}

.title {
  font-size: 18px;
}

.account {
  font-size: 12px;
  font-weight: 500;
  color: #7d8591;
}

.form-footer {
  padding-top: 22px;
  text-align: center;
}

.app-container ::v-deep .el-card__body {
  width: 100%;
  height: 100%;
}
</style>
