<template>
  <div class="sub-main">
    <div>
      <tips :tips="tips" title="须知" />
    </div>
    <div class="setting-form">
      <el-form label-position="left" label-width="110px" :model="form">
        <el-form-item label="通知方式" prop="notify_type">
          <el-radio-group v-model="form.notify_type">
            <el-radio-button label="mail"> 邮件 </el-radio-button>
            <el-radio-button label="sms"> 短信 </el-radio-button>
          </el-radio-group>
          <div class="input-tips">默认使用邮件通知, 如果要配置短信通知, 请提前配置好短信设置</div>
        </el-form-item>
        <el-form-item label="失效时长" prop="expire_minutes">
          <el-input-number v-model="form.expire_minutes" :min="1" :max="600" @change="objectUpdate" />
          <span class="f12 append-text"> 分钟</span>
          <div class="input-tips">验证码如果未使用多久失效。默认为 10 分钟，最长可设置 600 分钟</div>
        </el-form-item>
        <el-form-item label="邮件模板" prop="mail_template">
          <el-input
            v-model="form.mail_template"
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
        <el-form-item label="短信模板ID" prop="sms_template_id">
          <el-input v-model="form.sms_template_id" @input="objectUpdate()" />
          <div class="input-tips">
            <span>短信服务控制台获取，必须是云商审核成功的模板</span>
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
import { getSystemSetting, setVerifyCodeSetting } from '@/api/keyauth/system'

const tips = [
  '通过邮件或者短信, 向用户发送验证码, 二次确认身份'
]

export default {
  name: 'VerifyCode',
  components: { Tips },
  data() {
    return {
      tips,
      noUpdate: true,
      updateLoading: false,
      loading: null,
      verifyCode: {},
      form: {
        notify_type: 'mail',
        expire_minutes: 10,
        mail_template: '您的动态验证码为：{1}，{2}分钟内有效！，如非本人操作，请忽略本短信！',
        sms_template_id: ''
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
      this.noUpdate = JSON.stringify(this.form) === JSON.stringify(this.verifyCode)
    },
    async getSystemConfig() {
      try {
        var resp = await getSystemSetting()
        this.verifyCode = resp.data.verify_code
        this.form = Object.assign({}, this.verifyCode)
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
    update() {
      this.updateLoading = true
      setVerifyCodeSetting(this.form).then(resp => {
        this.currentSetting = resp.data
        this.noUpdate = true
        this.$message({
          message: '验证码配置保存成功',
          type: 'success',
          duration: 3 * 1000
        })
      }).finally(() => {
        this.updateLoading = false
      })
    },
    cancel() {
      this.form = JSON.parse(JSON.stringify(this.verifyCode))
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
