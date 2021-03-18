<template>
  <div class="container-wrapper">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="用户" value="account" />
            <el-option label="角色" value="login_ip" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item fr">
        <el-button type="primary" size="mini" @click="handleCreate()">添加权限</el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="queryloading"
      :data="permissions"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:12px;"
    >
      <el-table-column
        type="selection"
        width="45"
        align="center"
      />
      <el-table-column label="效力" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <svg-icon v-if="row.effect.toLowerCase() === 'allow'" icon-class="allow" />
          <svg-icon v-else icon-class="deny" />
        </template>
      </el-table-column>
      <el-table-column label="资源名称" prop="description" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.resource_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签建" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.label_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签值" prop="type" align="center" min-width="110">
        <template slot-scope="{row}">
          <span v-if="row.match_all">所有</span>
          <span v-else>
            <el-tag v-for="action in row.label_values" :key="action" style="margin-right: 12px;">{{ action }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button :loading="deleteLoading === row.id" size="mini" type="text" @click="handleDelete(row,$index)">
            移除权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listPermissionQuery.page_number" :limit.sync="listPermissionQuery.page_size" @pagination="getRolePermission" />
    <update-permission-drawer :visible.sync="dialogFormVisible" :role-id="roleId" @change="handlePermissionChanged" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Tips from '@/components/Tips'
import UpdatePermissionDrawer from '@/components/UpdatePermissionDrawer'
import { removePermissionFromRole } from '@/api/keyauth/role'

const tips = [
  '权限条目指匹配服务功能端点(Endpoint)的一组策略'
]

export default {
  name: 'RolePermission',
  components: { Pagination, Tips, UpdatePermissionDrawer },
  directives: { },
  props: {
    permissions: {
      type: Array,
      default: () => {
        return []
      }
    },
    roleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips,
      filterKey: 'account',
      filterValue: '',
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
      deletePermReq: {
        permission_id: []
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
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.dialogFormType = 'update'
      this.form = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlePermissionChanged(val) {
      this.$emit('change', val)
    },
    async handleDelete(row) {
      this.deleteLoading = row.id
      this.deletePermReq.permission_id = [row.id]
      try {
        await removePermissionFromRole(this.roleId, this.deletePermReq)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('change', true)
      } finally {
        this.deleteLoading = ''
      }
    },
    clearSearch() {
    },
    handleSearch() {
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

