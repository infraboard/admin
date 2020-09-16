<template>
  <div>
    <div>
      <tips :tips="tips" title="须知" />
    </div>
    <el-divider content-position="left">密码规则</el-divider>
    <div class="setting-form">
      <el-form label-position="left" :rules="rules" label-width="110px" :model="form">
        <el-form-item label="至少包含" prop="url">
          <el-checkbox v-model="checked">数字</el-checkbox>
          <el-checkbox v-model="checked">小写字母</el-checkbox>
          <el-checkbox v-model="checked">大写字母</el-checkbox>
          <el-checkbox v-model="checked">特殊字符(除空格)</el-checkbox>
        </el-form-item>
        <el-form-item label="最短密码长度" prop="user">
          <el-input-number v-model="num" :min="8" :max="32" />
          <span class="f12"> 个字符</span>
          <div class="input-tips">
            <span>限制密码长度。默认 8 个字符，最大长度可设置 32 个字符</span>
          </div>
        </el-form-item>
        <el-form-item label="定期失效" prop="password">
          <el-input-number v-model="num" :min="0" :max="365" />
          <span class="f12"> 个字符</span>
          <div class="input-tips">限制密码定期失效须重置密码。默认为 0 即不限制，最长可设置 365 天</div>
        </el-form-item>
        <el-form-item label="重复限制" prop="password">
          <el-input-number v-model="num" :min="1" :max="24" />
          <span class="f12"> 个字符</span>
          <div class="input-tips">限制新密码与历史密码的重复。默认与前 1 次密码不重复，最多可限制与前 24 次密码不重复</div>
        </el-form-item>
        <el-form-item label="重复限制" prop="password">
          <el-input-number v-model="num" :min="1" :max="10" />
          <span class="f12"> 个字符</span>
          <div class="input-tips">限制密码重试错误次数。默认为10次/小时，最小可设置1次/小时。密码重试超过约束次数将自动锁定 1 小时</div>
        </el-form-item>
        <el-divider content-position="left">登录限制</el-divider>
        <el-form-item label="异常登录限制" prop="user">
          <el-checkbox v-model="checked" />
          <div class="input-tips">
            <span>异地登录、30天未登录, 将要求用户进行二次身份校验，有效保障账号资产安全</span>
          </div>
        </el-form-item>
        <el-form-item label="IP登录限制" prop="user">
          <el-checkbox v-model="checked" />
          <div class="input-tips">
            <span>开启后，子账号（子用户和协作者）仅在限制条件下允许登录</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button>取 消</el-button>
          <el-button type="primary">保 存</el-button>
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
      checked: true,
      num: 0,
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

</style>
