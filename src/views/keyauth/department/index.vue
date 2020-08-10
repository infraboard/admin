<template>
  <div class="app-container">
    <el-container>
      <el-aside width="260px" style="background: #FFFFFF;">
        <div>
          <el-button class="filter-item" style="margin-left: 10px;" type="text" icon="el-icon-plus" @click="handleCreate">
            顶级部门
          </el-button>
        </div>
        <el-tree
          ref="tree"
          node-key="id"
          :data="departmentList"
          :props="props"
          :load="loadNode"
          lazy
          highlight-current
          :expand-on-click-node="false"
          @current-change="handleChanged"
        />
      </el-aside>
      <el-main>
        <el-card class="box-card f12">
          <el-row :gutter="8" style="margin-bottom: 12px;">
            <el-col :xs="6" :sm="6" :lg="2">
              <span class="attr-key">名称: </span>
            </el-col>
            <el-col :xs="18" :sm="18" :lg="6">
              <span>{{ current.name }}</span>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <span class="attr-key">上级部门: </span>
            </el-col>
            <el-col :xs="18" :sm="18" :lg="6">
              <span>{{ current.parent_id }}</span>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <span class="attr-key">创建时间: </span>
            </el-col>
            <el-col :xs="18" :sm="18" :lg="6">
              <span>{{ current.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="8" style="margin-bottom: 12px;">
            <el-col :xs="6" :sm="6" :lg="2">
              <span class="attr-key">负责人: </span>
            </el-col>
            <el-col :xs="18" :sm="18" :lg="6">
              <span>{{ current.manager }}</span>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" style="margin-top:12px;">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="权限" name="first">权限</el-tab-pane>
            <el-tab-pane label="用户" name="second">
              <div>
                <el-button type="primary" size="mini" @click="handleUpdate(row)">添加用户</el-button>
              </div>
              <div>
                <el-table
                  :key="tableKey"
                  v-loading="listLoading"
                  :data="departmentList"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;margin-top:12px;"
                >
                  <el-table-column label="名称" prop="name" align="center" min-width="110">
                    <template slot-scope="{row}">
                      <span>{{ row.name }}</span>
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
                  <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                      <el-button v-if="row.type !== 'build_in'" :loading="deleteLoading === row.name" size="mini" type="danger" @click="handleDelete(row,$index)">
                        移出用户
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getDepartmentList" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px" style="margin-left: 50px; margin-right: 50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="负责人" prop="manager_id">
          <el-input v-model="form.manager_id" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="createLoading" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDepartment, querySubDepartment, createDepartment, deleteDepartment } from '@/api/keyauth/department'
import Pagination from '@/components/Pagination'

export default {
  name: 'DepartmentList',
  components: { Pagination },
  directives: { },
  data() {
    return {
      activeName: 'second',
      current: {},
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      tableKey: 0,
      departmentList: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20,
        parent_id: '/'
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      form: {
        name: '',
        parent_id: '',
        manager_id: ''
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称!', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增部门' : '编辑部门'
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async loadNode(node, resolve) {
      // 获取子部门
      if (node.level >= 1) {
        const resp = await querySubDepartment(node.data.id, this.listQuery)
        return resolve(resp.data.items)
      }
    },
    async getDepartmentList() {
      // 获取顶层部门
      this.listLoading = true
      const resp = await queryDepartment(this.listQuery)
      this.departmentList = resp.data.items
      this.total = resp.data.total
      this.listLoading = false
      // 设置默认选择节点
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.departmentList[0].id)
        this.current = this.$refs.tree.getCurrentNode()
      })
    },
    handleChanged() {
      this.current = this.$refs.tree.getCurrentNode()
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
            // 新建
            this.createDepartment()
          } else {
            // 更新
          }
        }
      })
    },
    createDepartment() {
      this.createLoading = true
      // 创建请求
      createDepartment(this.form).then(resp => {
        this.dialogFormVisible = false
        this.departmentList.unshift(resp.data)
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.createLoading = false
      }).catch(() => {
        this.createLoading = false
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
    handleDelete(row, index) {
      this.deleteLoading = row.name
      deleteDepartment(row.id).then(resp => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.departmentList.splice(index, 1)
        this.deleteLoading = ''
      }).catch(() => {
        this.deleteLoading = ''
      })
    }
  }
}
</script>
