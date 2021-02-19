<template>
  <div class="market_out app-main">
    <el-tabs v-model="activeTab">
      <el-tab-pane lazy label="邮件设置" name="first">
        <mail-setting />
      </el-tab-pane>
      <el-tab-pane lazy label="短信设置" name="second">
        <sms-setting />
      </el-tab-pane>
      <el-tab-pane lazy label="验证码设置" name="third">
        <verify-code />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MailSetting from './components/MailSetting'
import SmsSetting from './components/SmsSetting'
import VerifyCode from './components/VerifyCode'

export default {
  name: 'DomainSetting',
  components: { MailSetting, SmsSetting, VerifyCode },
  directives: { },
  data() {
    return {
      activeTab: 'first'
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .market_out ::v-deep .el-tabs__nav-wrap {
    padding: 0px 0px 0px 25px;
}
</style>
