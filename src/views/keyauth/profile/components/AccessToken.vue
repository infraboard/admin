<template>
  <div class="app-container">
    <div>
      <tips :tips="seTips" type="warn" title="安全提示" />
      <tips :tips="opTips" type="info" title="使用提示" />
    </div>

    <div class="filter-container">
      <div class="filter-item">
        <el-button type="primary" size="mini" @click="handleCreateAccessToken">
          新建标签
        </el-button>
      </div>
      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreateAccessToken">
          新建标签
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
        <el-table-column
          type="selection"
          width="45"
          align="center"
        />
        <el-table-column label="用途描述" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Token" prop="access_token" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.access_token }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.enabled"><svg-icon icon-class="normal" /></span>
            <span v-else><svg-icon icon-class="locked" /></span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" min-width="230">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-divider v-if="row.type !== 'build_in'" direction="vertical" />
            <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="text" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import Tips from '@/components/Tips'
import { queryToken } from '@/api/keyauth/token'
import clipboard from '@/directive/clipboard/index.js'

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
      tableKey: 0,
      queryLoading: false,
      tokenList: []
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
    async queryToken() {
      this.queryLoading = true
      try {
        var resp = await queryToken({ grant_type: 'access' })
        this.tokenList = resp.data.items
      } finally {
        this.queryLoading = false
      }
    },
    handleCreateAccessToken() {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
