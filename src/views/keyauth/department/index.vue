<template>
  <div class="app-container">
    <el-container>
      <el-aside width="220px" style="background: #FFFFFF;margin-bottom: 0px;">
        <div>
          <el-button class="filter-item" style="margin-left: 10px;" type="text" icon="el-icon-plus" @click="handleCreate()">
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
        >
          <span slot-scope="{ data }" class="f12">
            <span>{{ data.name + ' (' + data.user_count + ')' }}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-main style="padding:0px 0px 0px 10px;">
        <el-card class="box-card f12">
          <el-row :gutter="8">
            <el-col :xs="12" :sm="12" :lg="12">
              <span class="title">部门信息</span>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12">
              <div class="fr">
                <div v-show="isEdit">
                  <el-button type="text" size="mini" @click="handleSave">保存</el-button>
                  <el-button type="text" size="mini" @click="handleCancel">取消</el-button>
                </div>
                <div v-show="!isEdit">
                  <el-button type="text" size="mini" @click="handleCreate(current.id)">新增</el-button>
                  <el-divider direction="vertical" />
                  <el-button type="text" size="mini" @click="handleDelete">删除</el-button>
                  <el-divider direction="vertical" />
                  <el-button type="text" size="mini" @click="handleUpdate">编辑</el-button>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">名称</span>
              <div class="attr-value">
                <span v-show="!isEdit">{{ current.name }}</span>
                <el-input
                  v-show="isEdit"
                  v-model="form.name"
                  placeholder="请输入部门名称"
                  maxlength="60"
                  show-word-limit
                  class="input-full-width"
                />
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">负责人</span>
              <div class="attr-value">
                <span v-show="!isEdit">{{ current.manager }}</span>
                <el-input
                  v-show="isEdit"
                  v-model="form.manager"
                  placeholder="请输入部门负责人"
                  maxlength="60"
                  show-word-limit
                  class="input-full-width"
                />
              </div>
            </el-row>
          </el-col>

          <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">上级部门</span>
              <div class="attr-value">
                <span v-if="current.parent_id">{{ current.parent_id }}</span>
                <span v-else>-</span>
              </div>
            </el-row>
          </el-col>

          <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">创建时间</span>
              <span class="attr-value">{{ current.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
          </el-col>
        </el-card>
        <el-card class="box-card" style="margin-top:12px;">
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户" name="first">
              <department-user :department-id="current.id" />
            </el-tab-pane>
            <el-tab-pane lazy label="空间" name="second">
              <department-namespace :department-name="current.name" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px" style="margin-left: 50px; margin-right: 50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="form.manager" />
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
import { queryDepartment, querySubDepartment, createDepartment, deleteDepartment, updateDepartment } from '@/api/keyauth/department'
import DepartmentUser from './components/DepartmentUser'
import DepartmentNamespace from './components/DepartmentNamespace'

export default {
  name: 'DepartmentList',
  components: { DepartmentUser, DepartmentNamespace },
  directives: { },
  data() {
    return {
      activeName: 'first',
      current: {},
      props: {
        children: 'children',
        isLeaf: 'leaf'
      },
      nodeResolve: {},
      tableKey: 0,
      departmentList: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      listDepartmentLoading: false,
      listQuery: {
        page_number: 1,
        page_size: 20,
        parent_id: '',
        with_sub_count: true,
        with_user_count: true
      },
      dialogFormVisible: false,
      dialogFormType: 'create',
      isEdit: false,
      form: {
        name: '',
        parent_id: '',
        manager: ''
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称!', trigger: 'change' }],
        manager: [{ required: true, message: '请选择部门负责人!', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增部门' : '编辑部门'
    },
    currentNode() {
      return this.$refs.tree.getNode(this.current.id)
    }
  },
  mounted() {
    this.getDepartmentList()
  },
  methods: {
    async loadNode(node, resolve) {
      // 获取子部门
      if (node.level >= 1) {
        this.nodeResolve.id = resolve
        const resp = await querySubDepartment(node.data.id, this.listQuery)
        const list = []
        resp.data.items.forEach(item => {
          item.leaf = item.sub_count === 0
          list.push(item)
        })
        return resolve(list)
      }
    },
    getDepartmentList() {
      // 获取顶层部门
      queryDepartment(this.listQuery).then(resp => {
        this.departmentList = []
        resp.data.items.forEach(item => {
          item.leaf = item.sub_count === 0
          this.departmentList.push(item)
        })
        this.total = resp.data.total
        // 设置默认选择节点
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.departmentList[0].id)
          this.handleChanged()
        })
      })
    },
    handleChanged() {
      this.current = this.$refs.tree.getCurrentNode()
      this.tableKey = this.current.id
      this.isEdit = false
    },
    resetForm() {
      this.form = {
        parent_id: '',
        name: '',
        manager: ''
      }
    },
    handleCreate(parentId) {
      this.dialogFormType = 'create'
      this.resetForm()
      this.form.parent_id = parentId
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
            this.create()
          } else {
            // 更新
          }
        }
      })
    },
    mergeChildrenData(data) {
      const datas = [data]
      this.currentNode.childNodes.forEach(v => {
        datas.push(v.data)
      })
      return datas
    },
    create() {
      // 创建请求
      this.createLoading = true
      if (this.form.parent_id) {
        this.currentNode.loading = true
      }
      createDepartment(this.form).then(resp => {
        this.dialogFormVisible = false
        if (!this.form.parent_id) {
          this.departmentList.push(resp.data)
        }

        this.$refs.tree.updateKeyChildren(this.current.id, this.mergeChildrenData(resp.data))
        console.log(this.currentNode)
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })

        this.createLoading = false
        this.currentNode.loading = false
        // 设置创建节点为当前节点
        this.$refs.tree.setCurrentKey(resp.data.id)
        this.handleChanged()
      }).catch(() => {
        this.createLoading = false
        this.currentNode.loading = false
      })
    },
    handleDelete() {
      if (this.currentNode) {
        this.currentNode.loading = true
        deleteDepartment(this.current.id).then(resp => {
          // 从tree中清除当前节点
          this.currentNode.loading = false
          this.$refs.tree.remove(this.current.id)

          // 设置下一个被选中的节点
          const parent = this.$refs.tree.getNode(this.current.parent_id)
          if (parent) {
            const childCount = parent.childNodes.length
            if (childCount > 0) {
              this.current = parent.childNodes[childCount - 1].data
            } else {
              this.current = parent.data
            }
          } else {
            // 顶层部门
            const topCount = this.departmentList.length
            if (topCount > 0) {
              this.current = this.departmentList[topCount - 1]
            }
          }
          this.$refs.tree.setCurrentKey(this.current.id)
        }).catch(() => {
          this.currentNode.loading = false
        })
      }
    },
    handleUpdate() {
      this.isEdit = true
      this.form = Object.assign({}, this.current) // copy obj
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    handleCancel() {
      this.isEdit = false
    },
    handleSave() {
      updateDepartment(this.current.id, this.form).then(resp => {
        // 更新视图
        this.current = resp.data
        this.currentNode.data = resp.data
        this.isEdit = false
      })
    }
  }
}
</script>
