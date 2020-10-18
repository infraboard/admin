<template>
  <div class="app-container">
    <div>
      <el-card class="box-card f12">
        <el-row :gutter="8">
          <el-col :xs="12" :sm="12" :lg="12">
            <span class="title">空间信息</span>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-button class="fr" type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          </el-col>
        </el-row>

        <el-row>
          <!-- 第一列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">名称</span>
              <span class="attr-value">{{ namespace.name }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">空间类型</span>
              <div class="attr-value">
                <span v-if="namespace.type">{{ namespace.type }}</span>
                <span v-else> - </span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">负责人</span>
              <span class="attr-value">{{ namespace.owner }}</span>
            </el-row>
          </el-col>
          <!-- 第二列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">空间ID</span>
              <span class="attr-value">{{ namespace.id }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">创建人</span>
              <span class="attr-value">{{ namespace.creater }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">所属部门</span>
              <div v-if="namespace.department">
                <router-link :to="'/user/department/'+namespace.department.id" class="link-type">
                  <span class="attr-value">{{ namespace.department.name }}</span>
                </router-link>
              </div>
              <span v-else>-</span>
            </el-row>
          </el-col>
          <!-- 第三列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">创建时间</span>
              <span class="attr-value">{{ namespace.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">更新时间</span>
              <span class="attr-value">{{ namespace.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">空间描述</span>
              <span class="attr-value">{{ namespace.description }}</span>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane lazy label="访问策略" name="first">
          <namespace-policy :namespace-id="namespaceId" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="90px" style="margin-left: 50px; margin-right: 50px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" />
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
import { describeNamespace } from '@/api/keyauth/namespace'
import NamespacePolicy from './components/NamespacePolicy'

export default {
  name: 'NamespaceDetail',
  components: { NamespacePolicy },
  directives: { },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      queryLoading: {},
      descNamespaceQuery: { with_department: true },
      namespace: {},
      createLoading: false,
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
    dialogTitle() {
      return this.dialogFormType === 'create' ? '新增空间' : '编辑空间'
    },
    namespaceId() {
      return this.$route.params.id
    }
  },
  created() {
    this.getNamespaceDetail()
  },
  methods: {
    getNamespaceDetail() {
      this.queryLoading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        target: '.app-main',
        body: true
      })
      // 获取用户列表
      describeNamespace(this.namespaceId, this.descNamespaceQuery).then(resp => {
        this.namespace = resp.data
      }).finally(() => {
        this.queryLoading.close()
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
            // 新建
            this.createNamespace()
          } else {
            // 更新
          }
        }
      })
    },
    createNamespace() {
      this.createLoading = true
      // 创建请求
      // createNamespace(this.form).then(resp => {
      //   this.dialogFormVisible = false
      //   this.roleList.unshift(resp.data)
      //   this.$notify({
      //     title: '成功',
      //     message: '创建成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   this.createLoading = false
      // }).catch(() => {
      //   this.createLoading = false
      // })
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
