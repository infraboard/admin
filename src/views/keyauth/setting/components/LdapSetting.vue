<template>
  <div class="sub-main">
    <div v-if="hasConfig">
      <div>
        <tips :tips="tips" title="须知" />
      </div>
      <div class="setting-form">
        <el-form label-position="left" :rules="rules" label-width="110px" :model="form">
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
            <el-button>取消</el-button>
            <el-button type="primary">保存</el-button>
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
  '移动端登录，由于运营商是随机分配IP，往往存在与实际登录地不符的情况',
  '若使用VPN或代理联网的，登录地点无法准确记录',
  '部分网络代理商的服务，存在IP地址不稳定的问题'
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
      loading: undefined,
      tips,
      hasConfig: true,
      showAttrMap: false,
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
    getLDAPConfig() {
      queryDomainLDAP().then(resp => {
        console.log(resp)
      }).catch(err => {
        this.loading.close()
        if (err.response.status === 404) {
          this.hasConfig = false
        } else {
          this.$message({
            message: err.response.data,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    saveLDAPConfig() {
      saveDomainLDAP()
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
