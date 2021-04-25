<template>
  <div class="app-container">
    <div>
      <tips :tips="seTips" type="warn" title="安全提示" />
      <tips :tips="opTips" type="info" title="使用提示" />
    </div>

    <div class="filter-container">
      <div class="filter-item">
        <el-button type="primary" :disabled="total > 4" size="mini" :loading="createTokenLoading" @click="handleCreateAccessToken">
          新建Token
        </el-button>
      </div>
    </div>

    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="queryLoading"
        :data="tokenList"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="描述" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Token" prop="access_token" align="center" min-width="260">
          <template slot-scope="{row}">
            <span>{{ row.access_token }}</span>
            <el-button v-clipboard:copy="row.access_token" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;margin-left:12px;" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" min-width="180">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" min-width="180">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.is_block"><svg-icon icon-class="locked" /></span>
            <span v-else><svg-icon icon-class="normal" /></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini" style="color:#E6A23C" disabled @click="handleUpdate(row)">禁用</el-button>
            <el-divider direction="vertical" />
            <el-button :loading="deleteLoading === row.access_token" size="mini" style="color:#F56C6C" type="text" @click="handleDeleteToken(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 测试对话框 -->
    <div>
      <el-dialog
        title="新建Token"
        :visible.sync="createTokenDialog"
        width="40%"
      >
        <el-form ref="createTokenForm" :rules="createTokenRules" label-position="left" label-width="80px" :model="createTokenForm">
          <el-form-item label="描述" prop="description">
            <el-input v-model="createTokenForm.description" placeholder="" />
            <div class="input-tips">token的描述, 用于区分用途</div>
          </el-form-item>
          <el-form-item label="过期时间" prop="description">
            <el-date-picker
              v-if="!createTokenForm.not_expired"
              v-model="createTokenForm.expired_at"
              type="datetime"
              :default-value="new Date()"
              default-time="23:59:59"
              placeholder="选择Token过期时间"
              align="right"
              :clearable="false"
              :picker-options="pickerOptions"
            />
            <el-checkbox v-model="createTokenForm.not_expired" style="margin-left:12px;">永不过期</el-checkbox>
            <div class="input-tips">过期后将无法使用, 需要重新申请新的</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createTokenDialog = false">取 消</el-button>
          <el-button type="primary" :loading="createTokenLoading" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tips from '@/components/Tips'
import { queryToken, deleteToken, login } from '@/api/keyauth/token'
import clipboard from '@/directive/clipboard/index.js'
import store from '@/store'

export default {
  name: 'AccessToken',
  components: { Tips },
  directives: {
    clipboard
  },
  data() {
    return {
      seTips: [
        'Token 是构建API请求的重要凭证，使用API 可以操作您名下的所有资源，为了您的财产和服务安全，请妥善保存和定期更换Token',
        '请勿通过任何方式（如 GitHub）上传或者分享您的Token，一旦泄露至外部渠道，可能造成您的资产重大损失',
        '使用低版本 TLS 协议调用 API 有安全风险，建议使用 TLS1.2 及以上版本'
      ],
      opTips: [
        '您的 Token 代表您的账号身份和所拥有的权限，等同于您的登录密码，切勿泄露他人'
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        },
        shortcuts: [{
          text: '一天后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一月后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }]
      },
      tableKey: 0,
      queryLoading: false,
      deleteLoading: '',
      tokenList: [],
      total: 10,
      createTokenDialog: false,
      createTokenLoading: false,
      createTokenForm: {
        grant_type: 'access',
        description: '',
        access_token: store.getters.accessToken,
        not_expired: true,
        expired_at: ''
      },
      createTokenRules: {
        host: [{ required: true, message: '请输入邮件(SMTP)服务器地址', trigger: 'change' }],
        username: [{ required: true, message: '请输入发送邮件的用户名称', trigger: 'change' }],
        password: [{ required: true, message: '请输入发送邮件的用户密码', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.queryToken()
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    async submit() {
      this.createTokenLoading = true
      try {
        await login(this.createTokenForm)
        this.queryToken()
      } finally {
        this.createTokenLoading = false
      }
    },
    async queryToken() {
      this.queryLoading = true
      try {
        var resp = await queryToken({ grant_type: 'access' })
        this.tokenList = resp.data.items
        this.total = resp.data.total
        this.createTokenDialog = false
        console.log(this.total)
      } finally {
        this.queryLoading = false
      }
    },
    handleCreateAccessToken() {
      this.createTokenDialog = true
    },
    async handleDeleteToken(tk) {
      this.deleteLoading = tk.access_token
      try {
        await deleteToken({ 'access_token': [tk.access_token] })
        this.queryToken()
      } finally {
        this.deleteLoading = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
