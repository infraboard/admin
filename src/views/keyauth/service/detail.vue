<template>
  <div class="app-container">
    <div>
      <el-card class="box-card f12">
        <el-row :gutter="8">
          <el-col :xs="12" :sm="12" :lg="12">
            <span class="title">服务信息</span>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-button class="fr" type="text" size="mini" @click="handleUpdate(row)">编辑</el-button>
          </el-col>
        </el-row>

        <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">名称</span>
            <span class="attr-value">{{ service.name }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">服务类型</span>
            <div class="attr-value">
              <span v-if="service.type">{{ service.type }}</span>
              <span v-else> - </span>
            </div>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">空间描述</span>
            <span class="attr-value">{{ service.description }}</span>
          </el-row>
        </el-col>

        <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">创建人</span>
            <span class="attr-value">{{ service.creater }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">服务ID</span>
            <span class="attr-value">{{ service.id }}</span>
          </el-row>
        </el-col>

        <el-col class="detail-col" :xs="18" :sm="18" :lg="8">
          <el-row class="attr-row">
            <span class="attr-key">创建时间</span>
            <span class="attr-value">{{ service.create_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-row>
          <el-row class="attr-row">
            <span class="attr-key">更新时间</span>
            <span class="attr-value">{{ service.update_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-row>
        </el-col>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top:12px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="接入凭证" name="first">
          <service-credential :service-name="service.name" />
        </el-tab-pane>
        <el-tab-pane label="功能列表" name="second">
          <service-endpoint lazy :service-name="service.name" />
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
import { describeService } from '@/api/keyauth/service'
import ServiceEndpoint from './components/ServiceEndpoint'
import ServiceCredential from './components/ServiceCredential'

export default {
  name: 'ServiceDetail',
  components: { ServiceEndpoint, ServiceCredential },
  directives: { },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      service: {},
      endpoints: [],
      total: 0,
      createLoading: false,
      deleteLoading: '',
      queryLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20
      },
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
      return this.dialogFormType === 'create' ? '新增服务' : '编辑服务'
    },
    serviceName() {
      return this.$route.params.id
    }
  },
  created() {
    this.getServiceDetail()
  },
  methods: {
    getServiceDetail() {
      this.queryLoading = true
      // 获取用户列表
      describeService(this.serviceName).then(resp => {
        this.service = resp.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
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
            this.createService()
          } else {
            // 更新
          }
        }
      })
    },
    createService() {
      this.createLoading = true
      // 创建请求
      // createService(this.form).then(resp => {
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
    },
    handleDelete(row, index) {
      this.deleteLoading = row.name
      // deleteService(row.id).then(resp => {
      //   this.$notify({
      //     title: '成功',
      //     message: '删除成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   this.roleList.splice(index, 1)
      //   this.deleteLoading = ''
      // }).catch(() => {
      //   this.deleteLoading = ''
      // })
    }
  }
}
</script>
