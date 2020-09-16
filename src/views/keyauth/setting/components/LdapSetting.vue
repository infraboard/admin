<template>
  <div class="sub-main">
    <div v-if="hasConfig">
      <div>
        <tips :tips="tips" title="须知" />
      </div>
      <div class="setting-form">
        <el-form ref="dataForm" label-position="left" :rules="rules" label-width="110px" :model="form">
          <el-form-item label="服务地址" prop="url">
            <el-input v-model="form.url" />
            <div class="input-tips">LDAP服务端地址, 比如ldap://127.0.0.1:389</div>
          </el-form-item>
          <el-form-item label="绑定DN" prop="user">
            <el-input v-model="form.user" />
            <div class="input-tips">
              <span>用于验证账号的管理员用户</span>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password />
            <div class="input-tips">用于验证账号的管理员密码</div>
          </el-form-item>
          <el-form-item label="属性映射">
            <el-checkbox v-model="showAttrMap" />
            <div class="input-tips">
              <span>当前系统子用户属性和LDAP中用户属性的映射关系</span>
            </div>
            <div v-show="showAttrMap">
              <div class="attr-item">
                <span class="f12 attr-key">用户组名称</span>
                <el-input v-model="form.group_name_attribute" class="attr-value" />
              </div>
              <div class="attr-item">
                <span class="f12 attr-key">用户名称</span>
                <el-input v-model="form.username_attribute" class="attr-value" />
              </div>
              <div class="attr-item">
                <span class="f12 attr-key">用户邮箱</span>
                <el-input v-model="form.mail_attribute" class="attr-value" />
              </div>
              <div class="attr-item">
                <span class="f12 attr-key">显示名称</span>
                <el-input v-model="form.display_name_attribute" class="attr-value" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="启用">
            <el-checkbox v-model="form.enabled" />
            <div class="input-tips">启动后允许子用户通过LDAP账号登录</div>
          </el-form-item>
          <el-form-item>
            <el-button>测试连接</el-button>
            <el-button>测试登录</el-button>
            <el-button @click="cancel">取消修改</el-button>
            <el-button type="primary" :loading="saveLoading" @click="saveLDAPConfig">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-else>
      <div class="f12 el-main">
        <span>你当前还没有配置LDAP, 点击配置</span>
        <br>
        <el-button type="primary" @click="hasConfig = true">配置LDAP</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import { queryDomainLDAP, saveDomainLDAP } from '@/api/keyauth/ldap'
import Tips from '@/components/Tips'

const tips = [
  '配置并开启了LDAP后, 子用户可以通过LDAP账号进行登录'
]

export default {
  name: 'LdapSetting',
  components: { Tips },
  props: {
    namespaceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
        group_name_attribute: 'cn',
        username_attribute: 'uid',
        mail_attribute: 'mail',
        display_name_attribute: 'displayname',
        enabled: true
      },
      rules: {
        url: [{ required: true, message: '请输入LDAP服务器地址', trigger: 'change' }],
        user: [{ required: true, message: '请输入admin用户', trigger: 'blur' }],
        password: [{ required: true, message: '请输入admin用户密码', trigger: 'blur' }]
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
    },
    saveLDAPConfig() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          saveDomainLDAP(this.form).then(resp => {
            this.form = resp.data
            this.saveLoading = false
            this.$message({
              message: 'ldap配置保存成功',
              type: 'success',
              duration: 3 * 1000
            })
          }).catch(() => {
            this.saveLoading = false
          })
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
