<template>
  <div :class="detailPageClass">
    <el-card class="box-card f12">
      <el-row :gutter="8">
        <el-col :xs="12" :sm="12" :lg="12">
          <span class="title">部门信息</span>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="fr">
            <div v-show="isEdit">
              <el-button type="text" size="mini" :loading="updateLoading" @click="handleSave">保存</el-button>
              <el-button type="text" size="mini" @click="handleCancel">取消</el-button>
            </div>
            <div v-show="!isEdit">
              <el-button type="text" size="mini" @click="handleCreate(current.id)">新增子部门</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" size="mini" style="color:#F56C6C" :loading="deleteLoading" @click="handleDelete">删除</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" size="mini" style="color:#E6A23C" @click="handleUpdate">编辑</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 详情数据 -->
      <el-row>
        <!-- 第一列 -->
        <el-col :xs="18" :sm="18" :lg="8">
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
                style="width:80%"
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
                style="width:80%"
              />
            </div>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">基础角色</span>
            <div class="attr-value">
              <span v-if="current.default_role">
                <router-link :to="'/permission/role/'+current.default_role.id" class="link-type">
                  <span>{{ current.default_role.name }}</span>
                </router-link>
              </span>
              <span v-else>-</span>
            </div>
          </el-row>
        </el-col>
        <!-- 第二列 -->
        <el-col :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">部门ID</span>
            <span class="attr-value">{{ current.id }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">子部门数</span>
            <span class="attr-value">{{ current.sub_count }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">上级部门</span>
            <div class="attr-value">
              <span v-if="current.parent_id">
                {{ current.parent_id }}</span>
              <span v-else>-</span>
            </div>
          </el-row>
        </el-col>
        <!-- 第三列 -->
        <el-col :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">创建时间</span>
            <span class="attr-value">{{ current.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">部门人数</span>
            <span class="attr-value">{{ current.user_count }}</span>
          </el-row>
        </el-col>
      </el-row>

    </el-card>
    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane lazy label="部门成员" name="first">
          <department-user :department-id="current.id" />
        </el-tab-pane>
        <el-tab-pane lazy label="部门空间" name="second">
          <department-namespace :department-id="current.id" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

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
import { describeDepartment, createDepartment, deleteDepartment, updateDepartment } from '@/api/keyauth/department'
import DepartmentUser from './components/DepartmentUser'
import DepartmentNamespace from './components/DepartmentNamespace'
import ChoiceSubuser from '@/components/ChoiceSubuser'

export default {
  name: 'DepartmentDetail',
  components: { DepartmentUser, DepartmentNamespace, ChoiceSubuser },
  directives: { },
  props: {
    department: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      detailPageClass: '',
      activeName: 'first',
      current: {},
      tableKey: 0,
      total: 0,
      queryLoading: {},
      descQuery: {
        with_sub_count: true,
        with_user_count: true,
        with_role: true
      },
      createLoading: false,
      deleteLoading: false,
      updateLoading: false,
      dialogFormVisible: false,
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
      return '新增子部门'
    }
  },
  watch: {
    department: {
      handler: function(val, oldVal) {
        this.current = val
        this.isEdit = false
        this.updateURL()
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$route.name === 'DepartmentDetail') {
      this.detailPageClass = 'app-container'
      this.queryLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        target: '.app-main',
        body: true
      })
      describeDepartment(this.$route.params.id, this.descQuery).then(resp => {
        this.current = resp.data
      }).finally(() => {
        this.queryLoading.close()
      })
    }
  },
  methods: {
    updateURL() {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query.id = this.current.id
      this.$router.push({ path: this.$route.path, query })
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
        this.$emit('created', resp.data)
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
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
    async handleDelete() {
      if (this.current) {
        this.deleteLoading = true
        try {
          var resp = await deleteDepartment(this.current.id)
          this.$emit('deleted', resp.data)
          this.$notify({
            title: '成功',
            message: `删除部门${this.current.name}成功`,
            type: 'success',
            duration: 2000
          })
        } catch (error) {
          this.$notify({
            title: '失败',
            message: `删除失败: ${error}`,
            type: 'error',
            duration: 2000
          })
        } finally {
          this.deleteLoading = false
        }
      }
    },
    handleUpdate() {
      this.isEdit = true
      this.form = Object.assign({}, this.current) // copy obj
    },
    handleCancel() {
      this.isEdit = false
    },
    async handleSave() {
      this.updateLoading = true
      try {
        var resp = await updateDepartment(this.current.id, this.form)
        this.$emit('updated', resp.data)
        this.$notify({
          title: '成功',
          message: `更新部门 ${resp.data.name} 成功`,
          type: 'success',
          duration: 2000
        })
        this.isEdit = false
      } catch (error) {
        this.$notify({
          title: '失败',
          message: `更新失败: ${error}`,
          type: 'error',
          duration: 2000
        })
      } finally {
        this.updateLoading = false
      }
    }
  }
}
</script>
