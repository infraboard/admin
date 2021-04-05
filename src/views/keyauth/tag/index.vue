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
        @expand-change="expandChangeHandle"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- <el-button type="primary" icon="el-icon-plus" class="fr" style="margin-bottom:8px;" @click="addValue">添加值</el-button> -->
            <el-table
              v-loading="props.row.loadingValues"
              :data="props.row.values"
              border
              style="width: 100%"
            >
              <el-table-column label="名称" width="120px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.value.value }}</span>
                </template>
              </el-table-column>
              <el-table-column label="别名" width="160px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.value.label }}</span>
                </template>
              </el-table-column>
              <el-table-column label="添加人" width="160px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.creater }}</span>
                </template>
              </el-table-column>
              <el-table-column label="添加时间" width="160px" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="描述" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.value.desc }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60px" align="center">
                <template slot-scope="{row,$index}">
                  <el-button type="text" icon="el-icon-delete" style="color:#F56C6C" @click="deleteValue(row,$index)" />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="标签名称" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.key_name }}</span>
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
            <el-button v-if="row.type !== 'build_in'" style="color:#F56C6C" :loading="deleteLoading === row.id" size="mini" type="text" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getTagList" />
    </div>
    <create-tag-drawer :visible.sync="dialogFormVisible" @change="updateNamespaceList" />
  </div>
</template>

<script>
import { queryTag, deleteTag, queryTagValue } from '@/api/keyauth/tag'
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
      formLabelWidth: '80px',
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
    this.getTagList()
  },
  methods: {
    async getTagList() {
      this.listLoading = true
      // 获取用户列表
      try {
        var resp = await queryTag(this.listQuery)
        var options = []
        resp.data.items.forEach(item => {
          item.values = []
          item.loadingValues = false
          options.push(item)
        })
        this.tagList = options
        this.total = resp.data.total
      } finally {
        this.listLoading = false
      }
    },
    handleCreateNamespace() {
      this.dialogFormVisible = true
    },
    updateNamespaceList() {
      this.getTagList()
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
    async expandChangeHandle(row, expanded) {
      console.log(row, expanded)
      // 展开时补充标签的值
      row.loadingValues = true
      try {
        var resp = await queryTagValue(row.id)
        console.log(resp)
        // eslint-disable-next-line require-atomic-updates
        row.values = resp.data.items
      } finally {
        // eslint-disable-next-line require-atomic-updates
        row.loadingValues = false
      }
    },
    addValue() {

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
