<template>
  <div>
    <div>
      <tips :tips="tips" title="须知" />
    </div>
    <div class="setting-form">
      <el-form label-position="left" label-width="110px" :model="form.password_security">
        <el-form-item label="失效时长">
          <el-input-number v-model="form.password_security.allow_expired_reset_days" :min="1" :max="600" @change="objectUpdate" />
          <span class="f12 append-text"> 分钟</span>
          <div class="input-tips">验证码如果未使用多久失效。默认为 10 分钟，最长可设置 600 分钟</div>
        </el-form-item>
        <el-form-item label="邮件模板">
          <el-input
            v-model="form.password_security"
            type="textarea"
            placeholder=""
            :autosize="{minRows: 2}"
            maxlength="1024"
            show-word-limit
          />
          <div class="input-tips">
            <span>支持文本和HTML格式模板</span>
          </div>
          <div class="input-tips">
            <span>注意: 模板只能有2个参数, 第一个为验证码, 第二个为过期时间(分钟)</span>
          </div>
          <div class="input-tips">
            <span>样例: 您的动态验证码为：{1}，{2}分钟内有效！，如非本人操作，请忽略本短信！</span>
          </div>
        </el-form-item>
        <el-form-item label="短信模板ID" prop="tencent.template_id">
          <el-input v-model="form.login_security" @input="objectUpdate()" />
          <div class="input-tips">
            <span>短信服务控制台获取，必须是腾讯云审核成功的模板</span>
          </div>
          <div class="input-tips">
            <span>注意: 模板只能有2个参数, 第一个为验证码, 第二个为过期时间(分钟)</span>
          </div>
          <div class="input-tips">
            <span>样例: 您的动态验证码为：{1}，{2}分钟内有效！，如非本人操作，请忽略本短信！</span>
          </div>
        </el-form-item>
        <el-form-item class="text-center">
          <el-button :disabled="noUpdate" @click="cancel">取消修改</el-button>
          <el-button :disabled="noUpdate" type="primary" :loading="updateLoading" @click="update">保存配置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import Tips from '@/components/Tips'
import { updateSecuritySetting } from '@/api/keyauth/setting'

const tips = [
  '通过邮件或者短信, 向用户发送验证码, 二次确认身份'
]

export default {
  name: 'VerifyCode',
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
            password_expired_days: 0,
            allow_expired_reset_days: 30
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
      noUpdate: true,
      updateLoading: false,
      form: {}
    }
  },
  computed: {
    currentSetting: {
      get() {
        return this.setting
      },
      set(val) {
        this.$emit('update:setting', val)
      }
    }
  },
  watch: {
    setting: {
      handler: function(val, oldVal) {
        this.form = JSON.parse(JSON.stringify(this.setting))
      },
      immediate: true
    }
  },
  methods: {
    update() {
      this.updateLoading = true
      updateSecuritySetting(this.form).then(resp => {
        this.currentSetting = resp.data
        this.noUpdate = true
        this.$message({
          message: '登录安全配置保存成功',
          type: 'success',
          duration: 3 * 1000
        })
      }).finally(() => {
        this.updateLoading = false
      })
    },
    objectUpdate(field) {
      this.noUpdate = JSON.stringify(this.form) === JSON.stringify(this.setting)
    },
    cancel() {
      this.form = JSON.parse(JSON.stringify(this.setting))
      this.noUpdate = true
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
