<template>
  <div class="app-container">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="标签名称" value="account" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreateNamespace">
          新建标签
        </el-button>
      </div>
    </div>

    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="tagList"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          type="selection"
          width="45"
          align="center"
        />
        <el-table-column label="标签名称" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <router-link :to="'/permission/namespace/'+row.id" class="link-type">
              <span>{{ row.key_name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="显示名称" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.key_label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作用范围" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.scope_type | scopeType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值来源" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.value_from | ValueFrom }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.creater }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.key_desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="230">
          <template slot-scope="{row,$index}">
            <!-- <el-button type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-divider v-if="row.type !== 'build_in'" direction="vertical" /> -->
            <el-button v-if="row.type !== 'build_in'" style="color:#F56C6C" :loading="deleteLoading === row.id" size="mini" type="text" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getNamespaceList" />
    </div>
    <create-tag-drawer :visible.sync="dialogFormVisible" @change="updateNamespaceList" />
  </div>
</template>

<script>
import { queryTag, deleteTag } from '@/api/keyauth/tag'
import Pagination from '@/components/Pagination'
import CreateTagDrawer from '@/components/CreateTagDrawer'
import Tips from '@/components/Tips'

const tips = [
  '标签用于做更细粒度的访问控制, 类似于空间里面的过滤器, 控制用户访问部分资源'
]

export default {
  name: 'TagList',
  components: { Pagination, CreateTagDrawer, Tips },
  directives: { },
  filters: {
    scopeType(key) {
      switch (key.toLocaleUpperCase()) {
        case 'GLOBAL':
          return '全局'
        case 'DOMAIN':
          return '域内'
        case 'NAMESPACE':
          return '空间'
      }
    },
    ValueFrom(key) {
      switch (key.toLocaleUpperCase()) {
        case 'MANUAL':
          return '手动录入'
        case 'HTTP':
          return 'HTTP远程拉取'
      }
    }
  },
  data() {
    return {
      filterKey: 'account',
      filterValue: '',
      tips,
      tableKey: 0,
      tagList: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listLoading: true,
      listQuery: {
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
      queryTag(this.listQuery).then(resp => {
        this.tagList = resp.data.items
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
      this.deleteLoading = row.id
      deleteTag(row.id).then(resp => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.tagList.splice(index, 1)
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
