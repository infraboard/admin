<template>
  <div class="container-wrapper">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="空间名称" value="account" />
          </el-select>
        </el-input>
      </div>
      <div class="filter-item" style="margin-left:12px;">
        <el-checkbox v-model="listQuery.with_sub_department" @change="getNamespaceList">包含子部门空间</el-checkbox>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" :disabled="selectedRow.length === 0" @click="handleCreateUser()">迁移空间</el-button>
        <el-button type="primary" size="mini" @click="handleCreateNamespace()">添加空间</el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="roleList"
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
      <el-table-column label="空间名称" prop="name" align="center" min-width="110">
        <template slot-scope="{row}">
          <router-link :to="'/permission/namespace/'+row.id" class="link-type">
            <span>{{ row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" prop="type" align="center" min-width="110">
        <template slot-scope="{row}">
          <span v-if="row.department">{{ row.department.name }}</span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="type" align="center" min-width="110">
        <template slot-scope="{row}">
          <span>{{ row.owner }}</span>
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
      <el-table-column label="操作" align="center" min-width="230">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-divider v-if="row.type !== 'build_in'" direction="vertical" />
          <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="text" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getNamespaceList" />

    <create-namespace-drawer :visible.sync="dialogFormVisible" :department-id="departmentId" @change="updateNamespaceList" />
  </div>
</template>

<script>
import { queryNamespace, deleteNamespace } from '@/api/keyauth/namespace'
import Pagination from '@/components/Pagination'
import CreateNamespaceDrawer from '@/components/CreateNamespaceDrawer'
import Tips from '@/components/Tips'

const tips = [
  '部门空间包含本部门空间和子部门空间'
]

export default {
  name: 'DepartmentNamespace',
  components: { Tips, Pagination, CreateNamespaceDrawer },
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
      filterKey: 'account',
      filterValue: '',
      tableKey: 0,
      roleList: [],
      total: 0,
      createLoading: false,
      selectedRow: [],
      deleteLoading: '',
      listLoading: false,
      listQuery: {
        with_department: true,
        with_sub_department: true,
        department_id: '',
        page_number: 1,
        page_size: 20
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        department: '',
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称!', trigger: 'change' }]
      }
    }
  },
  watch: {
    departmentId: {
      handler: function(did) {
        if (did) {
          this.listQuery.department_id = this.departmentId
          this.getNamespaceList()
        }
      },
      immediate: true
    }
  },
  methods: {
    getNamespaceList() {
      // 获取用户列表
      this.listLoading = true
      queryNamespace(this.listQuery).then(resp => {
        this.roleList = resp.data.items
        this.total = resp.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreateNamespace() {
      this.dialogFormVisible = true
    },
    updateNamespaceList() {
      this.getNamespaceList()
    },
    handleDelete(row, index) {
      this.deleteLoading = row.name
      deleteNamespace(row.id).then(resp => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.roleList.splice(index, 1)
        this.deleteLoading = ''
      }).catch(() => {
        this.deleteLoading = ''
      })
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

