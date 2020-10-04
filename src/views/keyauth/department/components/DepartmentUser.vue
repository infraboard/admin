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
        <el-button type="primary" size="mini" :disabled="selectedRow.length === 0" @click="handleCreateUser()">迁移用户</el-button>
        <el-button type="primary" size="mini" @click="handleCreateUser()">添加用户</el-button>
      </div>
    </div>
    <div>
      <el-table
        :key="tableKey"
        v-loading="listUserLoading"
        :data="currentUers"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelect"
      >
        <el-table-column
          type="selection"
          width="45"
          align="center"
        />
        <el-table-column label="用户名称" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-show="deleteLoading !== row.account" size="mini" type="text" @click="handleDelete(row,$index)">
              迁移部门
            </el-button>
            <choice-department v-if="deleteLoading === row.account" :key="row.account" :department.sync="form.department_id" @change="departmentChanged" />
            <el-button v-show="deleteLoading === row.account" size="mini" type="text" @click="handleCancel(row)">
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getDepartmentUser" />

      <create-account-drawer :visible.sync="dialogFormVisible" :department-id="departmentId" @change="updateAccountList" />
    </div>
  </div>
</template>

<script>
import { querySubAccount } from '@/api/keyauth/subAccount'
import Pagination from '@/components/Pagination'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import Tips from '@/components/Tips'

const tips = [
  '部门成员拥有部门角色的权限, 可以看见该部门下所有的空间'
]

export default {
  name: 'DepartmentUser',
  components: { Tips, Pagination, CreateAccountDrawer },
  directives: { },
  props: {
    departmentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips,
      selectedRow: [],
      filterKey: 'account',
      filterValue: '',
      currentUers: [],
      tableKey: 0,
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listUserLoading: false,
      listQuery: {
        page_number: 1,
        page_size: 20,
        department_id: ''
      },
      dialogFormVisible: false
    }
  },
  watch: {
    departmentId: {
      handler: function(did) {
        if (did) {
          this.listQuery.department_id = this.departmentId
          this.getDepartmentUser()
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    getDepartmentUser() {
      this.listUserLoading = true
      this.listQuery.department_id = this.departmentId
      querySubAccount(this.listQuery).then(resp => {
        this.currentUers = resp.data.items
        this.total = resp.data.total
        this.listUserLoading = false
      }).catch(() => {
        this.listUserLoading = false
      })
    },
    handleCreateUser() {
      this.dialogFormVisible = true
    },
    updateAccountList() {
      this.getDepartmentUser()
    },
    handleDelete(row, index) {
      console.log(row)
      this.deleteLoading = row.account
      this.form.department_id = row.department_id
    },
    handleCancel(row) {
      this.deleteLoading = ''
    },
    clearSearch() {

    },
    updateUser() {

    },
    handleSelect(selection) {
      this.selectedRow = selection
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
