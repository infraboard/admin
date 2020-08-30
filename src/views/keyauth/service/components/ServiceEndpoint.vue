<template>
  <div>
    <el-table
      :key="tableKey"
      v-loading="queryloading"
      :data="endpoints"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:12px;"
    >
      <el-table-column label="资源名称" prop="description" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.resource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问标签" min-width="110px" align="center">
        <template slot-scope="{row}">
          <div v-if="row.labels">
            <div v-for="(value,name) in row.labels" :key="name" class="github-badge">
              <span class="badge-subject">{{ name }}</span><span class="badge-value bg-blue">{{ value }}</span>
            </div>
          </div>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column label="访问方法" min-width="60px" align="center">
        <template slot-scope="{row}">
          <el-tag effect="plain" :style="methodColer(row.method)">{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="访问路径" prop="name" align="center" min-width="180">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="函数名称" prop="type" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.function_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份认证" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.auth_enable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限认证" align="center" min-width="60">
        <template slot-scope="{row}">
          <span>{{ row.auth_enable }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listEndpointQuery.page_number" :limit.sync="listEndpointQuery.page_size" @pagination="getServiceEndpoint" />
  </div>
</template>

<script>
import { queryEndpoint } from '@/api/keyauth/endpoint'
import Pagination from '@/components/Pagination'

export default {
  name: 'ServiceEndpoint',
  components: { Pagination },
  directives: { },
  props: {
    serviceName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listEndpointQuery: {
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
    getServiceEndpoint() {
      this.queryloading = true
      // 获取用户列表
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
