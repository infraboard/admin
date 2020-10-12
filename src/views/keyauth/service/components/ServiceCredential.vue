<template>
  <div class="container-wrapper">
    <tips :tips="seTips" type="warn" title="安全提示" />
    <tips :tips="opTips" type="info" title="使用提示" />
    <el-row style="margin-top:18px;">
      <el-col :span="4">
        <span class="attr-key f12">状态</span>
        <span class="attr-value f12" style="margin-left:12px;">
          <span v-if="!token.is_block"><svg-icon icon-class="normal" /></span>
          <span v-else><svg-icon icon-class="locked" /></span>
        </span>
      </el-col>
      <el-col :span="4">
        <span class="attr-key f12">操作</span>
        <el-button type="text" style="padding:0px;margin-left:12px;">
          刷新
        </el-button>
      </el-col>
      <el-col :span="8">
        <span class="attr-key f12">凭证</span>
        <span class="attr-value f12" style="margin-left:12px;">{{ token.access_token }}</span>
        <el-button v-clipboard:copy="token.access_token" v-clipboard:success="clipboardSuccess" type="text" icon="el-icon-document-copy" style="padding:0px;margin-left:12px;" />
      </el-col>
      <el-col :span="8">
        <span class="attr-key f12">创建时间</span>
        <span class="attr-value f12" style="margin-left:12px;">{{ token.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </el-col>
    </el-row>
    <el-divider />
    <div style="margin-top:22px;">
      <div class="filter-container">
        <div class="filter-item">
          <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
            <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
              <el-option label="用户名称" value="account" />
            </el-select>
          </el-input>
        </div>

        <div class="filter-item fr">
          <el-button type="primary" size="mini" @click="handleCreatePolicy()">添加策略</el-button>
        </div>
      </div>

      <div>
        <el-table
          :key="tableKey"
          v-loading="listPolicyLoading"
          :data="policys"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="空间" prop="name" align="center" min-width="110">
            <template slot-scope="{row}">
              <span>{{ row }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="type" align="center" min-width="110">
            <template slot-scope="{row}">
              <router-link :to="'/permission/role/'+row.role_id" class="link-type">
                <span>{{ row.role.name }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="范围" prop="name" align="center" min-width="110">
            <template slot-scope="{row}">
              <span v-if="row.scope">{{ row.scope }}</span>
              <span v-else> 全部 </span>
            </template>
          </el-table-column>
          <el-table-column label="过期时间" prop="description" align="center" min-width="110">
            <template slot-scope="{row}">
              <span v-if="row.expired_time">{{ row.expired_time }}</span>
              <span v-else> 永不过期 </span>
            </template>
          </el-table-column>
          <el-table-column label="加入时间" min-width="150px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="添加人" prop="type" align="center" min-width="110">
            <template slot-scope="{row}">
              <span>{{ row.creater }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="text" @click="handleDelete(row,$index)">
                移除策略
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listPolicyQuery.page_number" :limit.sync="listPolicyQuery.page_size" @pagination="getNamespacePolicy" />
      </div>

      <create-policy-drawer :visible.sync="dialogFormVisible" :account="token.account" @change="updatePolicy" />
    </div>
  </div>
</template>

<script>
import Tips from '@/components/Tips'
import { queryPolicy } from '@/api/keyauth/policy'
import { describeServiceToken } from '@/api/keyauth/service'
import Pagination from '@/components/Pagination'
import CreatePolicyDrawer from '@/components/CreatePolicyDrawer'
import clipboard from '@/directive/clipboard/index.js'

export default {
  name: 'ServiceCredential',
  components: { Tips, Pagination, CreatePolicyDrawer },
  directives: {
    clipboard
  },
  props: {
    serviceId: {
      type: String,
      default: ''
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
      filterKey: 'account',
      filterValue: '',
      tableKey: 0,
      token: {},
      policys: [],
      total: 0,
      createLoading: false,
      listPolicyLoading: false,
      deleteLoading: '',
      queryLoading: true,
      listPolicyQuery: {
        account: '',
        with_role: true,
        page_number: 1,
        page_size: 20
      },
      dialogFormVisible: false
    }
  },
  watch: {
    serviceId: {
      handler: function(sid) {
        if (sid) {
          this.queryServiceToken()
        }
      },
      immediate: true
    }
  },
  methods: {
    queryServiceToken() {
      describeServiceToken(this.serviceId).then(resp => {
        this.token = resp.data
      })
    },
    getNamespacePolicy() {
      this.listPolicyLoading = true
      queryPolicy(this.listPolicyQuery).then(resp => {
        this.policys = resp.data.items
        this.total = resp.data.total
        this.listPolicyLoading = false
      }).catch(() => {
        this.listPolicyLoading = false
      })
    },
    clipboardSuccess() {
      this.$notify({
        message: '复制成功',
        duration: 1500,
        customClass: 'notify-success'
      })
    },
    handleCreatePolicy() {
      this.dialogFormVisible = true
    },
    updatePolicy(val) {
      this.getNamespacePolicy()
    },
    handleDelete(row, index) {
      this.deleteLoading = row.name
      // deleteNamespace(row.id).then(resp => {
      //   this.$notify({
      //     title: '成功',
      //     message: '删除成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   this.roleList.splice(index, 1)
      //   this.deleteLoading = ''
      // }).catch(() => {
      //   this.deleteLoading = ''
      // })
    },
    clearSearch() {
    },
    handleSearch() {

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
