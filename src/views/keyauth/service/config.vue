<template>
  <div class="app-container">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="服务名称" value="account" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreate">
          新增服务
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
        <el-table-column label="服务名称" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <router-link :to="'/service/'+row.id" class="link-type">
              <span>{{ row.name }}</span>
            </router-link>
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
        <el-table-column label="状态" prop="status" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.enabled"><svg-icon icon-class="normal" /></span>
            <span v-else><svg-icon icon-class="locked" /></span>
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

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getServiceList" />
    </div>

    <create-service-drawer :visible.sync="dialogFormVisible" @change="updateServiceList" />
  </div>
</template>

<script>
import { queryService, deleteService } from '@/api/keyauth/service'
import Pagination from '@/components/Pagination'
import CreateServiceDrawer from '@/components/CreateServiceDrawer'
import Tips from '@/components/Tips'

const tips = [
  '微服务的配置'
]

export default {
  name: 'ServiceConfig',
  components: { Pagination, CreateServiceDrawer, Tips },
  directives: { },
  data() {
    return {
      tips,
      filterKey: 'account',
      filterValue: '',
      tableKey: 0,
      roleList: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称!', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增服务' : '编辑服务'
    }
  },
  created() {
    this.getServiceList()
  },
  methods: {
    getServiceList() {
      this.listLoading = true
      // 获取用户列表
      queryService(this.listQuery).then(response => {
        this.roleList = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    updateServiceList() {
      this.getServiceList()
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleDelete(row, index) {
      this.deleteLoading = row.name
      deleteService(row.id).then(resp => {
        this.$notify({
          message: `删除服务[${row.name}]成功`,
          customClass: 'notify-success'
        })
        this.getServiceList()
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
