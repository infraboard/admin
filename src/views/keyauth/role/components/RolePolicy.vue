<template>
  <div class="container-wrapper">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="用户" value="account" />
            <el-option label="角色" value="login_ip" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreatePolicy()">添加策略</el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listPolicyLoading"
      :data="policys"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        width="45"
        align="center"
      />
      <el-table-column label="用户" prop="name" align="center" min-width="110">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="空间" prop="type" align="center" min-width="110">
        <template slot-scope="{row}">
          <router-link :to="'/permission/namespace/'+row.namespace_id" class="link-type">
            <span v-if="row.namespace">{{ row.namespace.name }}</span>
            <span v-else> {{ row.namespace_id }} </span>
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

    <pagination v-show="total>0" :total="total" :page.sync="listPolicyQuery.page_number" :limit.sync="listPolicyQuery.page_size" @pagination="getRolePolicy" />
    <create-policy-drawer :visible.sync="dialogFormVisible" :role-id="roleId" @change="updatePolicy" />
  </div>
</template>

<script>
import { queryPolicy } from '@/api/keyauth/policy'
import Pagination from '@/components/Pagination'
import CreatePolicyDrawer from '@/components/CreatePolicyDrawer'
import Tips from '@/components/Tips'

const tips = [
  '该角色被分配给了哪些用户(空间内)'
]

export default {
  name: 'RolePolicy',
  components: { Pagination, CreatePolicyDrawer, Tips },
  directives: { },
  props: {
    roleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips,
      filterKey: 'account',
      filterValue: '',
      listPolicyQuery: {
        role_id: '',
        with_namespace: true,
        page_number: 1,
        page_size: 20
      },
      policys: [],
      tableKey: 0,
      total: 0,
      deleteLoading: false,
      queryloading: false,
      dialogFormVisible: false
    }
  },
  watch: {
    roleId: {
      handler: function(rid) {
        if (rid) {
          this.listPolicyQuery.role_id = rid
          this.getRolePolicy()
        }
      },
      immediate: true
    }
  },
  created() {
    this.getRolePolicy()
  },
  methods: {
    getRolePolicy() {
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
      this.getRolePolicy()
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

