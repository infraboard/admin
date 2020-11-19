<template>
  <div>
    <div>
      <tips :tips="tips" title="须知" />
    </div>
    <el-divider content-position="left">密码规则</el-divider>
    <div class="setting-form">
      <el-form label-position="left" :rules="rules" label-width="110px" :model="setting.password_security">
        <el-form-item label="至少包含" prop="contains">
          <el-checkbox v-model="setting.password_security.include_number" disabled>数字</el-checkbox>
          <el-checkbox v-model="setting.password_security.include_lower_letter" disabled>小写字母</el-checkbox>
          <el-checkbox v-model="setting.password_security.include_upper_letter">大写字母</el-checkbox>
          <el-checkbox v-model="setting.password_security.include_symbols">特殊字符(除空格)</el-checkbox>
        </el-form-item>
        <el-form-item label="最短密码长度" prop="min_length">
          <el-input-number v-model="setting.password_security.length" :min="8" :max="32" />
          <span class="f12 append-text"> 个字符</span>
          <div class="input-tips">
            <span>限制密码长度。默认 8 个字符，最大长度可设置 32 个字符</span>
          </div>
        </el-form-item>
        <el-form-item label="定期失效" prop="expire_days">
          <el-input-number v-model="setting.password_security.password_expired_days" :min="0" :max="365" />
          <span class="f12 append-text"> 天</span>
          <div class="input-tips">限制密码定期失效须重置密码。默认为 0 即不限制，最长可设置 365 天</div>
        </el-form-item>
        <el-form-item label="重复限制" prop="repeate">
          <el-input-number v-model="setting.password_security.repeate_limite" :min="1" :max="24" />
          <span class="f12 append-text"> 次</span>
          <div class="input-tips">限制新密码与历史密码的重复。默认与前 1 次密码不重复，最多可限制与前 24 次密码不重复</div>
        </el-form-item>
        <el-form-item label="重试限制" prop="max_retry">
          <el-input-number v-model="setting.login_security.retry_lock_config.retry_limite" :min="1" :max="10" />
          <span class="f12 append-text"> 次</span>
          <div class="input-tips">限制密码重试错误次数。默认为5次，最小可设置1次</div>
        </el-form-item>
        <el-form-item label="锁定时间" prop="lock_time">
          <el-input-number v-model="setting.login_security.retry_lock_config.locked_minite" :min="1" :max="60" />
          <span class="f12 append-text"> 分钟</span>
          <div class="input-tips">密码重试超过约束次数将自动锁定的时间, 默认锁定30分钟</div>
        </el-form-item>
        <el-divider content-position="left">登录限制</el-divider>
        <el-form-item label="异常登录限制" prop="user">
          <el-checkbox v-model="setting.login_security.exception_lock" />
          <div class="input-tips">
            <span>异地登录、30天未登录, 将要求用户进行二次身份校验，有效保障账号资产安全</span>
          </div>
        </el-form-item>
        <el-form-item label="IP登录限制" prop="user">
          <el-checkbox v-model="setting.login_security.ip_limite" />
          <div class="input-tips">
            <span>开启后，子账号（子用户和协作者）仅在限制条件下允许登录</span>
          </div>
        </el-form-item>
        <el-form-item v-if="setting.login_security.ip_limite" label="" prop="user">
          <el-radio-group v-model="setting.login_security.ip_limite_config.type">
            <el-radio-button label="white_list"> 白名单 </el-radio-button>
            <el-radio-button label="black_lsit"> 黑名单 </el-radio-button>
          </el-radio-group>
          <div class="input-tips">
            <span v-show="setting.login_security.ip_limite_config.type === 'white_list'">设置白名单限制后，允许子账号在白名单限制 IP（段）内登录控制台</span>
            <span v-show="setting.login_security.ip_limite_config.type === 'black_lsit'">设置黑名单限制后，不允许子账号在黑名单限制 IP（段）内登录控制台</span>
          </div>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button>取消修改</el-button>
          <el-button type="primary">保存配置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import Tips from '@/components/Tips'
import { updateSecuritySetting } from '@/api/keyauth/setting'

const tips = [
  '您在该模块所设定的密码规则仅适用于使用登录密码的子用户',
  '登录密码失效后子用户将无法通过其他登录方式进行登录，须重置登录密码',
  '为了您的账户安全，我们不会在子用户重置密码时提示您设置的密码规则细则'
]

export default {
  name: 'SecuritySetting',
  components: { Tips },
  props: {
    setting: {
      type: Object,
      default: () => {
        return {
          password_security: {
            include_number: true,
            include_lower_letter: true,
            include_upper_letter: true,
            include_symbols: true,
            length: 8,
            repeate_limite: 1,
            password_expired_days: 0
          },
          login_security: {
            exception_lock: true,
            exception_lock_config: {
              not_login_days: 30,
              other_place_login: true
            },
            ip_limite: false,
            ip_limite_config: {
              type: 'white_list',
              ip: []
            },
            retry_lock: true,
            retry_lock_config: {
              retry_limite: 5,
              locked_minite: 30
            }
          }
        }
      }
    }
  },
  data() {
    return {
      tips,
      form: {}
    }
  },
  methods: {
    update() {
      updateSecuritySetting().then(resp => {
        console.log(resp)
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

.append-text {
  margin-left: 4px;
}

</style>
