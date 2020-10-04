<template>
  <div class="app-container">
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

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreateNamespace">
          新建空间
        </el-button>
      </div>
    </div>

    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="roleList"
        fit
        highlight-current-row
        style="width: 100%;"
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
            <div v-if="row.department">
              <router-link :to="'/user/department/'+row.department.id" class="link-type">
                <span>{{ row.department.name }}</span>
              </router-link>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.owner }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
    </div>
    <create-namespace-drawer :visible.sync="dialogFormVisible" @change="updateNamespaceList" />
  </div>
</template>

<script>
import { queryNamespace, deleteNamespace } from '@/api/keyauth/namespace'
import Pagination from '@/components/Pagination'
import CreateNamespaceDrawer from '@/components/CreateNamespaceDrawer'
import Tips from '@/components/Tips'

const tips = [
  '空间负责控制用户访问的范围, 用户只能访问已授权的空间'
]

export default {
  name: 'NamespaceList',
  components: { Pagination, CreateNamespaceDrawer, Tips },
  directives: { },
  data() {
    return {
      filterKey: 'account',
      filterValue: '',
      tips,
      tableKey: 0,
      roleList: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listLoading: true,
      listQuery: {
        with_department: true,
        page_number: 1,
        page_size: 20
      },
      dialogFormVisible: false
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增空间' : '编辑空间'
    }
  },
  created() {
    this.getNamespaceList()
  },
  methods: {
    getNamespaceList() {
      this.listLoading = true
      // 获取用户列表
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

    }
  }
}
</script>

<style lang="scss" scoped>
.mall-actions {
  margin-left: 12px;
}

.app-container ::v-deep .el-select {
  width: 102px;
}
.app-container ::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
