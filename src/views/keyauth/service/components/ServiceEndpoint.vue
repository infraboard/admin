<template>
  <div class="container-wrapper">
    <tips :tips="tips" type="info" title="温馨提示" />

    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="资源名称" value="resource" />
            <el-option label="访问标签" value="label" />
            <el-option label="访问方式" value="method" />
            <el-option label="访问路径" value="path" />
            <el-option label="函数名称" value="function_name" />
          </el-select>
        </el-input>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="queryloading"
      :data="endpoints"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="资源名称" prop="description" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.entry.resource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问标签" min-width="110px">
        <template slot-scope="{row}">
          <div v-if="row.entry.labels">
            <div v-for="(value,name) in row.entry.labels" :key="name" class="github-badge">
              <span class="badge-subject">{{ name }}</span><span class="badge-value bg-blue">{{ value }}</span>
            </div>
          </div>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column label="访问方法" min-width="60px">
        <template slot-scope="{row}">
          <el-tag effect="plain" :style="methodColer(row.entry.method)">{{ row.entry.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="访问路径" prop="name" min-width="180">
        <template slot-scope="{row}">
          <span>{{ row.entry.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="函数名称" prop="type" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.entry.function_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份认证" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.entry.auth_enable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限认证" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.entry.auth_enable }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listEndpointQuery.page_number" :limit.sync="listEndpointQuery.page_size" :page-sizes="[10, 20, 50, 100, 200, 500]" @pagination="getServiceEndpoint" />
  </div>
</template>

<script>
import Tips from '@/components/Tips'
import { queryEndpoint } from '@/api/keyauth/endpoint'
import Pagination from '@/components/Pagination'

const tips = [
  '资源动作标签: get, list, create, update, delete',
  '角色通过标签匹配服务提供的功能'
]

export default {
  name: 'ServiceEndpoint',
  components: { Tips, Pagination },
  directives: { },
  props: {
    serviceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips,
      filterKey: 'resource',
      filterValue: '',
      listEndpointQuery: {
        service_id: '',
        page_number: 1,
        page_size: 20
      },
      endpoints: [],
      tableKey: 0,
      total: 0,
      activeName: 'first',
      deleteLoading: false,
      queryloading: false,
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
  },
  created() {
    this.getServiceEndpoint()
  },
  methods: {
    resetQuery() {
      this.listEndpointQuery = {}
    },
    clearSearch() {
      this.resetQuery()
      this.getServiceEndpoint()
    },
    handleSearch() {
      this.listEndpointQuery.page_number = 1
      switch (this.filterKey) {
        case 'resource':
          this.listEndpointQuery.resource = this.filterValue
          break
        case 'method':
          this.listEndpointQuery.method = this.filterValue
          break
        case 'path':
          this.listEndpointQuery.path = this.filterValue
          break
        case 'function_name':
          this.listEndpointQuery.function_name = this.filterValue
          break
      }
      this.getServiceEndpoint()
    },
    getServiceEndpoint() {
      this.queryloading = true
      // 获取用户列表
      this.listEndpointQuery.service_ids = this.serviceId
      queryEndpoint(this.listEndpointQuery).then(response => {
        this.endpoints = response.data.items
        this.total = response.data.total
        this.queryloading = false
      }).catch(() => {
        this.queryloading = false
      })
    },
    resetForm() {
      this.form = {
        name: '',
        description: ''
      }
    },
    handleCreate() {
      this.dialogFormType = 'create'
      this.resetForm()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogFormType === 'create') {
            this.createRole()
          } else {
            // 更新
          }
        }
      })
    },
    handleUpdate(row) {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    methodColer(method) {
      let color = '#67C23A'
      switch (method) {
        case 'POST':
          color = '#E6A23C'
          break
        case 'GET':
          color = '#67C23A'
          break
        case 'PATCH':
          color = '#909399'
          break
        case 'PUT':
          color = '#409EFF'
          break
        case 'DELETE':
          color = '#F56C6C'
          break
      }

      return 'border-color: ' + color + ';' + 'color: ' + color
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
