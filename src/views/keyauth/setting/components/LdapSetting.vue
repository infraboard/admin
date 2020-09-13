<template>
  <div class="app-container">
    <el-form label-position="left" :rules="rules" label-width="110px" :model="form" @validate="handleValidate">
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
      <el-form-item label="启用">
        <el-checkbox v-model="form.enabled" />
      </el-form-item>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LdapSetting',
  props: {
    namespaceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        url: 'ldap://127.0.0.1:389',
        user: 'cn=admin,dc=example,dc=org',
        password: '',
        base_dn: '',
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
