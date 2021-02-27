<template>
  <div class="container-wrapper">
    <tips :tips="seTips" type="warn" title="安全提示" />
    <tips :tips="opTips" type="info" title="使用提示" />
    <el-row style="margin-top:18px;">
      <el-col :span="2">
        <span class="attr-key f12">状态</span>
        <span class="attr-value f12" style="margin-left:12px;">
          <span v-if="service.client_enabled"><svg-icon icon-class="normal" /></span>
          <span v-else><svg-icon icon-class="locked" /></span>
        </span>
      </el-col>
      <el-col :span="4">
        <span class="attr-key f12">操作</span>
        <el-button v-if="service.client_enabled" disabled type="text" style="padding:0px;margin-left:12px;">
          启用
        </el-button>
        <el-button v-else disabled type="text" style="padding:0px;margin-left:12px;">
          禁用
        </el-button>
        <el-button type="text" style="padding:0px;margin-left:12px;" :loading="refreshLoading" @click="refreshClientSecret">
          刷新
        </el-button>
      </el-col>
      <el-col :span="4">
        <span class="attr-key f12">刷新时间</span>
        <span v-if="service.client_refresh_at" class="attr-value f12" style="margin-left:12px;">{{ service.client_refresh_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        <span v-else class="attr-value f12" style="margin-left:12px;">-</span>
      </el-col>
      <el-col :span="6">
        <span class="attr-key f12">Client ID</span>
        <span class="attr-value f12" style="margin-left:12px;">{{ service.client_id }}</span>
        <el-button v-clipboard:copy="service.client_secret" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;margin-left:12px;" />
      </el-col>
      <el-col :span="8">
        <span class="attr-key f12">Client Secret</span>
        <span class="attr-value f12" style="margin-left:12px;">{{ service.client_secret }}</span>
        <el-button v-clipboard:copy="service.client_secret" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;margin-left:12px;" />
      </el-col>
    </el-row>
    <el-divider />
    <div style="margin-top:22px;">
      <div class="filter-container">
        <span />
      </div>
    </div>
  </div>
</template>

<script>
import Tips from '@/components/Tips'
import { refreshServiceClientSecret } from '@/api/keyauth/service'
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'ServiceCredential',
  components: { Tips },
  directives: {
    clipboard
  },
  props: {
    service: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      seTips: [
        '服务凭证是服务间调用的唯一凭证, 默认永不过期, 为了保障系统安全，请妥善保存和定期更换凭证',
        '服务凭证默认具有所有空间的访客权限'
      ],
      opTips: [
        '服务凭证代表服务的身份和所拥有的权限,切勿泄露',
        '服务凭证主要用于服务注册和服务间调用',
        '服务的操作日志将保存在事件中心'
      ],
      refreshLoading: false,
      dialogFormVisible: false
    }
  },
  methods: {
    clipboardSuccess() {
      this.$notify({
        message: '复制成功',
        duration: 1500,
        customClass: 'notify-success'
      })
    },
    refreshClientSecret() {
      this.refreshLoading = true
      refreshServiceClientSecret(this.serviceId).then(resp => {
        this.token = resp.data
      }).finally(() => {
        this.refreshLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-wrapper ::v-deep .el-select {
  width: 102px;
}

.container-wrapper ::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.container-wrapper ::v-deep .el-divider--horizontal {
  margin: 4px 0px 12px 0px;
}
</style>
