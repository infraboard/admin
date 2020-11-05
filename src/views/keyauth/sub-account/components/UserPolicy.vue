<template>
  <div class="container-wrapper">
    <div>
      <tips :tips="tips" />
    </div>
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
        <el-table-column label="用户" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.account }}</span>
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

    <create-policy-drawer :visible.sync="dialogFormVisible" :account="account" @change="updatePolicy" />
  </div>
</template>

<script>
import { queryPolicy } from '@/api/keyauth/policy'
import Pagination from '@/components/Pagination'
import CreatePolicyDrawer from '@/components/CreatePolicyDrawer'
import Tips from '@/components/Tips'

const tips = [
  '用户在对应空间下所属角色'
]

export default {
  name: 'NamespacePolicy',
  components: { Pagination, CreatePolicyDrawer, Tips },
  directives: { },
  props: {
    account: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips,
      filterKey: 'account',
      filterValue: '',
      tableKey: 0,
      namespace: {},
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
    account: {
      handler: function(acc) {
        if (acc) {
          this.listPolicyQuery.account = acc
          this.getNamespacePolicy()
        }
      },
      immediate: true
    }
  },
  methods: {
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
</style>
