<template>
  <div>
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

</template>

<script>
import Tips from '@/components/Tips'

const tips = [
  '您在该模块所设定的密码规则仅适用于使用登录密码的子用户',
  '登录密码失效后子用户将无法通过其他登录方式进行登录，须重置登录密码',
  '为了您的账户安全，我们不会在子用户重置密码时提示您设置的密码规则细则'
]

export default {
  name: 'UserSetting',
  components: { Tips },
  props: {
    namespaceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips,
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
  methods: {
  }
}
</script>

<style lang="scss">
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

</style>
