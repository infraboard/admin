<template>
  <div class="container-wrapper">
    <div>
      <tips :tips="tips" />
    </div>
    <div>
      <el-collapse accordion style="margin-bottom:12px;">
        <el-collapse-item>
          <template slot="title">
            <span>加入申请 （{{ departmentJoinApplyTotal }}）</span>
          </template>
          <div class="infinite-list-wrapper" style="overflow:auto">
            <ul
              v-infinite-scroll="loadNextPage"
              class="list"
              infinite-scroll-disabled="disabled"
            >
              <li v-for="(jp, index) in departmentJoinApplyList" :key="jp.id" class="list-item">
                <div style="width:10%">
                  <span style="margin-left:12px;">{{ jp.account }}</span>
                </div>
                <div style="width:20%">
                  <span>{{ jp.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </div>
                <div style="width:50%">
                  <span>{{ jp.message }}</span>
                </div>
                <div style="width:20%">
                  <div class="fr" style="margin-right:12px;">
                    <el-button type="success" size="mini" @click="dealJoinApply(index, jp.id, 'passed')">同意</el-button>
                    <el-button type="danger" size="mini" @click="dealJoinApply(index, jp.id, 'deny')">拒绝</el-button>
                  </div>

                </div>
              </li>
            </ul>
            <span v-if="loadingNextJoinApply" class="tips-item">加载中...</span>
            <span v-if="departmentJoinApplyTotal === 0" class="tips-item">没有需要处理的申请</span>
          </div>
        </el-collapse-item>
      </el-collapse>
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
import { queryJoinApply, dealJoinApply } from '@/api/keyauth/department'
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
      dialogFormVisible: false,
      loadingNextJoinApply: false,
      departmentJoinApplyTotal: 0,
      departmentJoinApplyList: [],
      listdepartmentJoinApply: {
        page_number: 1,
        page_size: 10,
        department_id: '',
        status: 'pendding'
      }
    }
  },
  watch: {
    departmentId: {
      handler: function(did) {
        if (did) {
          this.listQuery.department_id = this.departmentId
          this.getDepartmentUser()

          this.departmentJoinApplyList = []
          this.queryJoinApply()
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
    },
    queryJoinApply() {
      this.listdepartmentJoinApply.department_id = this.departmentId
      queryJoinApply(this.listdepartmentJoinApply).then(resp => {
        this.departmentJoinApplyTotal = resp.data.total
        if (resp.data.items) {
          resp.data.items.forEach(element => {
            this.departmentJoinApplyList.push(element)
          })
        }
      })
    },
    loadNextPage() {
    },
    noMore() {
      return this.departmentJoinApplyList.length() >= this.departmentJoinApplyTotal
    },
    async dealJoinApply(index, id, status) {
      await dealJoinApply(id, { status })
      this.departmentJoinApplyList.splice(index, 1)
      this.departmentJoinApplyTotal--
      if (status === 'passed') {
        this.getDepartmentUser()
      }
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

.infinite-list-wrapper .list-item+.list-item {
    margin-top: 2px;
}

.container-wrapper ::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}

.infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    height: 44px;
    background: #e8f3fe;
    color: #828386;
}

.infinite-list-wrapper .tips-item {
    display: flex;
    align-items: center;
    height: 44px;
    justify-content: center;
    color: #828386;
}

li {
    display: list-item;
    text-align: -webkit-match-parent;
}

.infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
}
</style>
