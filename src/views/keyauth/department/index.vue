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
          :expand-on-click-node="true"
          @current-change="handleChanged"
        >
          <span slot-scope="{ data }" class="f12">
            <span>{{ data.name + ' (' + data.user_count + ')' }}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-main style="padding:0px 0px 0px 10px;">
        <department-detail :department="current" @created="updateCreateSub" @deleted="handleDelete" @updated="handleUpdate" />
      </el-main>
    </el-container>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px" style="margin-left: 50px; margin-right: 50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <choice-subuser :user.sync="form.manager" />
          <div class="input-tips">
            <span>部门负责人负责管理部门的人员与空间</span>
          </div>
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
import { queryDepartment, querySubDepartment, createDepartment } from '@/api/keyauth/department'
import DepartmentDetail from './detail'
import ChoiceSubuser from '@/components/ChoiceSubuser'

export default {
  name: 'DepartmentList',
  components: { DepartmentDetail, ChoiceSubuser },
  directives: { },
  data() {
    return {
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
      listDepartmentLoading: false,
      listQuery: {
        page_number: 1,
        page_size: 20,
        parent_id: '',
        with_sub_count: true,
        with_user_count: true,
        with_role: true
      },
      dialogFormVisible: false,
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
      return '新增顶级部门'
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
      this.listQuery.parent_id = '.'
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
    },
    resetForm() {
      this.form = {
        parent_id: '',
        name: '',
        manager: ''
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
          this.create()
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
    async create() {
      this.createLoading = true
      try {
        var resp = await createDepartment(this.form)
        resp.data.leaf = true
        this.departmentList.unshift(resp.data)
        this.dialogFormVisible = false
        // 设置创建节点为当前节点
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(resp.data.id)
          this.handleChanged()
        })

        this.$notify({
          title: '成功',
          message: `创建顶级部门: ${resp.data.name} 成功`,
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        this.$notify({
          title: '失败',
          message: `创建失败: ${error}`,
          type: 'error',
          duration: 2000
        })
      } finally {
        this.createLoading = false
      }
    },
    updateCreateSub(data) {
      if (this.currentNode.isLeaf) {
        this.currentNode.data.leaf = false
        this.currentNode.isLeaf = false
        this.currentNode.expanded = true
      }
      data.leaf = true
      this.$refs.tree.updateKeyChildren(this.current.id, this.mergeChildrenData(data))
    },
    handleDelete() {
      if (this.currentNode) {
        // 从tree中清除当前节点
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
            this.current = this.departmentList[0]
          }
        }

        this.$refs.tree.setCurrentKey(this.current.id)
      }
    },
    handleUpdate(data) {
      // 更新视图
      this.current = data
      this.currentNode.data = data
    }
  }
}
</script>
