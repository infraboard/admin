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
      :key="queryTimestamp"
      v-loading="queryloading"
      :data="permissions"
      border
      fit
      highlight-current-row
      style="width: 100%;"
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
          <div v-if="resourceVisible === row.id">
            <el-checkbox-group v-model="row.choice_values">
              <el-checkbox v-for="a in resource.actions" :key="a" :label="a">{{ a }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else>
            <span v-if="row.match_all">所有</span>
            <span v-else>
              <el-tag v-for="action in row.label_values" :key="action" style="margin-right: 12px;">{{ action }}</el-tag>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="210">
        <template slot-scope="{row,$index}">
          <el-button v-if="resourceVisible === row.id" style="color:#67C23A;" :loading="saveLoading === row.id" size="mini" type="text" @click="handleSave(row,$index)">
            保存
          </el-button>
          <el-button v-else :loading="editLoading === row.id" style="color:#E6A23C" size="mini" type="text" @click="handleEdit(row,$index)">
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button :loading="deleteLoading === row.id" style="color:#F56C6C" size="mini" type="text" @click="handleDelete(row,$index)">
            移除
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
import { removePermissionFromRole, listRolePermission, listResource, updatePermission } from '@/api/keyauth/role'

const tips = [
  '权限条目指匹配服务功能端点(Endpoint)的一组策略'
]

export default {
  name: 'RolePermission',
  components: { Pagination, Tips, UpdatePermissionDrawer },
  directives: { },
  props: {
  },
  data() {
    return {
      permissions: [],
      queryloading: false,
      queryTimestamp: 0,
      queryResourceLoading: false,
      deleteLoading: false,
      editLoading: false,
      resourceVisible: false,
      resource: null,
      saveLoading: false,
      tips,
      filterKey: 'account',
      filterValue: '',
      listPermissionQuery: {
        page_number: 1,
        page_size: 20
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        name: '',
        description: ''
      },
      deletePermReq: {
        permission_id: []
      }
    }
  },
  computed: {
    roleId() {
      return this.$route.params.id
    },
    total() {
      return this.permissions.length
    }
  },
  mounted() {
    this.getRolePermission()
  },
  methods: {
    async getRolePermission() {
      this.permissions = []
      this.queryloading = true
      try {
        var resp = await listRolePermission(this.roleId)
        resp.data.items.forEach(item => {
          item.choice_values = (item.label_values) ? item.label_values : []
          this.permissions.push(item)
        })
        this.queryTimestamp = new Date().getTime()
      } finally {
        this.queryloading = false
      }
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
    handlePermissionChanged(val) {
      this.getRolePermission()
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
        this.getRolePermission()
      } finally {
        this.deleteLoading = ''
      }
    },
    async handleEdit(row) {
      this.editLoading = true
      try {
        var resp = await listResource({
          service_ids: row.service_id,
          resources: row.resource_name
        })
        if (resp.data.items && resp.data.items.length > 0) {
          this.resource = resp.data.items[0]
          this.resourceVisible = row.id
        } else {
          this.$message({
            message: '资源没有方法列表可供选择',
            type: 'error'
          })
        }
      } finally {
        this.editLoading = false
      }
    },
    async handleSave(row) {
      this.saveLoading = true
      try {
        const resp = await updatePermission(row.id, {
          label_key: row.label_key,
          match_all: row.match_all,
          label_values: row.choice_values
        })
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        // eslint-disable-next-line require-atomic-updates
        row.label_values = resp.data.label_values
      } finally {
        this.saveLoading = false
        this.resourceVisible = ''
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

