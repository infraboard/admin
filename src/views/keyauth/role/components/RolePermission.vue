<template>
  <div>
    <el-button type="primary" size="mini" @click="handleUpdate(row)">添加权限</el-button>

    <el-table
      :key="tableKey"
      v-loading="queryloading"
      :data="permissions"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:12px;"
    >
      <el-table-column label="效力" prop="name" align="center" min-width="110">
        <template slot-scope="{row}">
          <span>{{ row.effect }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签建" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.label_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签值" prop="type" align="center" min-width="110">
        <template slot-scope="{row}">
          <span v-if="row.match_all">所有</span>
          <span v-else>{{ row.label_values }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源名称" prop="description" align="center" min-width="110">
        <template slot-scope="{row}">
          <span>{{ row.resource_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="text" @click="handleDelete(row,$index)">
            移除权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listPermissionQuery.page_number" :limit.sync="listPermissionQuery.page_size" @pagination="getRolePermission" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'RolePermission',
  components: { Pagination },
  directives: { },
  props: {
    permissions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      listPermissionQuery: {
        page_number: 1,
        page_size: 20
      },
      tableKey: 0,
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
    total() {
      return this.permissions.length
    }
  },
  created() {
  },
  methods: {
    getRolePermission() {
      this.listPolicyLoading = true
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
    }
  }
}
</script>
