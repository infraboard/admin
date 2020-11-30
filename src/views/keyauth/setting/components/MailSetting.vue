<template>
  <div class="sub-main">
    <div v-if="hasConfig">
      <div>
        <tips :tips="tips" title="须知" />
      </div>
      <div class="setting-form">
        <el-form ref="dataForm" label-position="left" :rules="rules" label-width="110px" :model="form">
          <el-form-item label="服务地址" prop="url">
            <el-input v-model="form.url" @input="objectUpdate('url')" />
            <div class="input-tips">LDAP服务端地址, 比如ldap://127.0.0.1:389</div>
          </el-form-item>
          <el-form-item label="绑定DN" prop="user">
            <el-input v-model="form.user" @input="objectUpdate('user')" />
            <div class="input-tips">
              <span>用于验证账号的管理员用户</span>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password @input="objectUpdate('password')" />
            <div class="input-tips">用于验证账号的管理员密码</div>
          </el-form-item>
          <el-form-item label="用户过滤器" prop="users_filter">
            <el-input v-model="form.users_filter" @input="objectUpdate" />
            <div class="input-tips">根据字段搜索用户</div>
          </el-form-item>
          <el-form-item label="组过滤器" prop="groups_filter">
            <el-input v-model="form.groups_filter" @input="objectUpdate" />
            <div class="input-tips">根据字段搜索用户组</div>
          </el-form-item>
          <el-form-item label="配置验证">
            <el-button :loading="checkConnLoading" @click="checkDomainLDAP">发送测试</el-button>
            <div class="input-tips">验证通过后才能保存配置</div>
          </el-form-item>
          <el-form-item class="text-center">
            <el-button :disabled="noUpdate" @click="cancel">取消修改</el-button>
            <el-button :disabled="noUpdate || !connectOK" type="primary" :loading="saveLoading" @click="saveLDAPConfig">保存配置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <el-dialog
        title="LDAP用户登录测试"
        :visible.sync="checkLoginDialog"
        width="40%"
      >
        <el-form ref="checkLoginDataForm" :rules="checkLoginrules" label-position="left" label-width="80px" :model="loginCheckForm">
          <el-form-item label="用户" prop="username">
            <el-input v-model="loginCheckForm.username" placeholder="username@example.org" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginCheckForm.password" show-password placeholder="LDAP登录用户密码" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkLoginDialog = false">取 消</el-button>
          <el-button type="primary" :loading="checkLoginLoading" @click="checkLDAPLogin">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div></template>

<script>
import { queryDomainLDAP, saveDomainLDAP } from '@/api/keyauth/ldap'
import { login } from '@/api/keyauth/token'
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
      checkLoginLoading: false,
      checkLoginDialog: false,
      checkConnLoading: false,
      connectOK: false,
      noUpdate: true,
      saveLoading: false,
      loading: undefined,
      tips,
      hasConfig: true,
      showAttrMap: false,
      ldap: {},
      form: {
        url: 'ldap://127.0.0.1:389',
        user: 'cn=admin,dc=example,dc=org',
        password: '',
        base_dn: '',
        additional_users_dn: '',
        users_filter: '(uid={input})',
        groups_filter: '(|(member={dn})(uid={username})(uid={input}))',
        group_name_attribute: 'cn',
        username_attribute: 'uid',
        mail_attribute: 'mail',
        display_name_attribute: 'displayname',
        enabled: true
      },
      loginCheckForm: {
        grant_type: 'ldap',
        username: '',
        password: ''
      },
      rules: {
        url: [{ required: true, message: '请输入LDAP服务器地址', trigger: 'change' }],
        user: [{ required: true, message: '请输入LDAP管理用户', trigger: 'blur' }],
        password: [{ required: true, message: '请输入LDAP管理用户密码', trigger: 'blur' }]
      },
      checkLoginrules: {
        username: [{ required: true, message: '请输入LDAP管理用户', trigger: 'blur' }],
        password: [{ required: true, message: '请输入LDAP管理用户密码', trigger: 'blur' }]
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
    this.getLDAPConfig()
  },
  methods: {
    objectUpdate(field) {
      if (field === 'url' || field === 'user' || field === 'password') {
        this.connectOK = false
      }
      // 启动的修改不检测连接状态
      if (field === 'enabled') {
        this.connectOK = true
      }
      this.noUpdate = JSON.stringify(this.form) === JSON.stringify(this.ldap)
    },
    async getLDAPConfig() {
      try {
        var resp = await queryDomainLDAP()
        this.ldap = resp.data
        this.form = Object.assign({}, this.ldap)
      } catch (e) {
        if (e.response.status === 404) {
          this.hasConfig = false
        } else {
          this.$message({
            message: e.response.data,
            type: 'error',
            duration: 5 * 1000
          })
        }
      } finally {
        this.loading.close()
      }
    },
    cancel() {
      this.form = Object.assign({}, this.ldap)
      this.noUpdate = true
    },
    saveLDAPConfig() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          saveDomainLDAP(this.form).then(resp => {
            this.ldap = resp.data
            this.noUpdate = true
            this.connectOK = false
            this.$message({
              message: 'ldap配置保存成功',
              type: 'success',
              duration: 3 * 1000
            })
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    },
    checkDomainLDAP() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.checkConnLoading = true
          saveDomainLDAP(this.form, { dry_run: true }).then(resp => {
            this.connectOK = true
            console.log(resp)
            this.$notify({
              message: `连接测试成功`,
              customClass: 'notify-success'
            })
          }).finally(() => {
            this.checkConnLoading = false
          })
        }
      })
    },
    resetLoginForm() {
      this.loginCheckForm.username = ''
      this.loginCheckForm.password = ''
    },
    handleCheckLDAPLogin() {
      this.resetLoginForm()
      this.checkLoginDialog = true
      this.$nextTick(() => {
        this.$refs['checkLoginDataForm'].clearValidate()
      })
    },
    checkLDAPLogin() {
      this.$refs['checkLoginDataForm'].validate((valid) => {
        if (valid) {
          this.checkLoginLoading = true
          login(this.loginCheckForm).then(resp => {
            this.checkLoginDialog = false
            this.$notify({
              message: `用户[${resp.data.account}]登录成功`,
              customClass: 'notify-success'
            })
          }).finally(() => (
            this.checkLoginLoading = false
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
