<template>
  <div class="sub-main">
    <!-- 提醒 -->
    <div>
      <tips :tips="tips" title="须知" />
    </div>
    <!-- 邮箱设置表单 -->
    <div class="setting-form">
      <el-form ref="dataForm" label-position="left" :rules="rules" label-width="110px" :model="form">
        <el-form-item label="服务地址" prop="host">
          <el-input v-model="form.host" @input="objectUpdate()" />
          <div class="input-tips">SMTP服务端地址, 比如smtp.163.com:465</div>
          <div class="input-tips">注意: 请不要使用25号端口, 因为腾讯云（阿里云）出于安全考虑，会禁用25端口</div>
        </el-form-item>
        <el-form-item label="邮箱用户" prop="username">
          <el-input v-model="form.username" @input="objectUpdate()" />
          <div class="input-tips">
            <span>用于发送邮件的用户, 比如example@163.com</span>
          </div>
        </el-form-item>
        <el-form-item label="邮箱密码" prop="password">
          <el-input v-model="form.password" show-password @input="objectUpdate()" />
          <div class="input-tips">用于发送邮件的用户密码</div>
        </el-form-item>
        <el-form-item label="显示用户" prop="user">
          <el-input v-model="form.from" @input="objectUpdate()" />
          <div class="input-tips">
            <span>发件人显示名称, 默认使用配置的邮箱用户作为发送账号</span>
          </div>
        </el-form-item>
        <el-form-item label="配置验证">
          <el-button @click="handleCheckSend">发送测试</el-button>
          <div class="input-tips">验证通过后才能保存配置</div>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button :disabled="noUpdate" @click="cancel">取消修改</el-button>
          <el-button :disabled="noUpdate || !sendTestOk" type="primary" :loading="saveLoading" @click="saveEmailConfig">保存配置</el-button>
        </el-form-item>
      </el-form>
      <!-- 测试对话框 -->
      <div>
        <el-dialog
          title="邮件发送测试"
          :visible.sync="checkSendDialog"
          width="40%"
        >
          <el-form ref="checkSendEmailForm" :rules="checkSendRules" label-position="left" label-width="80px" :model="sendCheckForm">
            <el-form-item label="收件人" prop="to">
              <el-input v-model="sendCheckForm.to" placeholder="username@example.org" />
              <div class="input-tips">收件人邮箱地址, 如果多个请使用逗号分隔</div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="checkSendDialog = false">取 消</el-button>
            <el-button type="primary" :loading="checkSendLoading" @click="checkEmailSend">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getSystemSetting, testEmailSetting, setEmailSetting } from '@/api/keyauth/system'
import Tips from '@/components/Tips'

const tips = [
  '用于向用户发送邮件, 比如发送验证码'
]

export default {
  name: 'MailSetting',
  components: { Tips },
  props: {},
  data() {
    return {
      sendTestOk: false,
      checkSendDialog: false,
      checkSendLoading: false,
      noUpdate: true,
      saveLoading: false,
      loading: undefined,
      tips,
      email: {},
      form: {
        host: '',
        username: '',
        password: '',
        from: ''
      },
      sendCheckForm: {
        to: '',
        subject: '邮件发送验证',
        content: '该邮件为验证邮件, 请忽略'
      },
      rules: {
        host: [{ required: true, message: '请输入邮件(SMTP)服务器地址', trigger: 'change' }],
        username: [{ required: true, message: '请输入发送邮件的用户名称', trigger: 'change' }],
        password: [{ required: true, message: '请输入发送邮件的用户密码', trigger: 'change' }]
      },
      checkSendRules: {
        to: [{ required: true, message: '请输入收件人邮箱地址', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.loading = this.$loading({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      target: '.sub-main',
      body: true
    })
    this.getSystemConfig()
  },
  methods: {
    objectUpdate() {
      this.noUpdate = JSON.stringify(this.form) === JSON.stringify(this.email)
    },
    async getSystemConfig() {
      try {
        var resp = await getSystemSetting()
        this.email = resp.data.email
        this.form = Object.assign({}, this.email)
      } catch (e) {
        this.$message({
          message: e.response.data,
          type: 'error',
          duration: 5 * 1000
        })
      } finally {
        this.loading.close()
      }
    },
    cancel() {
      this.form = Object.assign({}, this.email)
      this.noUpdate = true
    },
    saveEmailConfig() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          setEmailSetting(this.form).then(resp => {
            this.email = resp.data
            this.noUpdate = true
            this.sendTestOk = false
            this.$message({
              message: '邮件发送配置保存成功',
              type: 'success',
              duration: 3 * 1000
            })
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    },
    resetCheckSendForm() {
      this.sendCheckForm.to = ''
    },
    handleCheckSend() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.resetCheckSendForm()
          this.checkSendDialog = true
          this.$nextTick(() => {
            this.$refs['checkSendEmailForm'].clearValidate()
          })
        }
      })
    },
    checkEmailSend() {
      this.$refs['checkSendEmailForm'].validate((valid) => {
        if (valid) {
          this.checkSendLoading = true
          Object.assign(this.sendCheckForm, this.form)
          testEmailSetting(this.sendCheckForm).then(resp => {
            this.checkSendDialog = false
            this.$notify({
              message: `邮件发送成功: ${this.sendCheckForm.to}, 测试通过, 可以保存配置了`,
              customClass: 'notify-success'
            })
            this.sendTestOk = true
          }).finally(() => (
            this.checkSendLoading = false
          ))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-item {
  margin-bottom:12px;
  margin-top:12px;
  display: flex;
}

.attr-key {
  margin-right: 32px;
  width: 8%;
}

.attr-value {
  width:92%;
}

.setting-form {
  margin-top: 12px;
}

.el-main {
  // background-color: #E9EEF3;
  display: flexbox;
  color: #333;
  text-align: center;
  line-height: 40px;
}

</style>
