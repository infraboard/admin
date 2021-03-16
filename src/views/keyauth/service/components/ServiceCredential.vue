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
        <el-button v-clipboard:copy="service.client_id" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;margin-left:12px;" />
      </el-col>
      <el-col :span="8">
        <span class="attr-key f12">Client Secret</span>
        <span class="attr-value f12" style="margin-left:12px;">{{ service.client_secret }}</span>
        <el-button v-clipboard:copy="service.client_secret" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;margin-left:12px;" />
      </el-col>
    </el-row>
    <el-divider />
    <div style="margin-top:22px;" class="f12">
      <el-radio-group v-model="language">
        <el-radio-button label="Golang" />
        <el-radio-button label="Java" disabled />
        <el-radio-button label="Python" disabled />
      </el-radio-group>
      <p>1. 安装项目初始化工具mcube</p>
      <p>go install github.com/infraboard/mcube/cmd/mcube</p>
      <p>2. 创建工程目录并使用mcube初始化项目</p>
      <p>mkdir demo && cd demo</p>
      <p>mcube init "github.com/infraboard/demo"</p>
      <p>3. 启动服务</p>
      <p>make run</p>
    </div>
  </div>
</template>

<script>
import Tips from '@/components/Tips'
import { refreshServiceClientSecret } from '@/api/keyauth/service'
import clipboard from '@/directive/clipboard/index.js'

import marked from 'marked'
var rendererMD = new marked.Renderer()
marked.setOptions({
  renderer: rendererMD,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

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
        '服务凭证是服务间调用的唯一凭证, 为了保障系统安全，请妥善保存和定期更换凭证'
      ],
      opTips: [
        '服务凭证主要用于服务注册和服务间调用',
        '服务凭证并不能直接操作用户的资源, 如果需要操作具体资源, 还需要用户Token'
      ],
      refreshLoading: false,
      dialogFormVisible: false,
      language: 'Golang'
    }
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.markdownContent, { sanitize: true })
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success'
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
