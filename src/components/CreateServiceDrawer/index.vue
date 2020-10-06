<template>
  <el-drawer
    ref="drawer"
    :title="title"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="32%"
  >
    <div class="drawer-content">
      <el-form ref="serviceForm" :model="form" :rules="rules">
        <el-form-item label="服务名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" maxlength="60" show-word-limit />
          <div class="input-tips">
            <span>服务名称需要保持唯一, 不能重复</span>
          </div>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 4}"
            maxlength="200"
            show-word-limit
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="createNamespaceLoading" @click="submit">{{ createNamespaceLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { createService } from '@/api/keyauth/service'
import { describeDepartment } from '@/api/keyauth/department'

export default {
  name: 'CreateServiceDrawer',
  components: { },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '新增服务',
      type: String
    },
    departmentId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      departmentName: '',
      departmentQuery: {},
      queryDepartmentLoading: false,
      departmentList: [],
      table: false,
      dialog: false,
      createNamespaceLoading: false,
      form: {
        department_id: '',
        account: '',
        password: '',
        mobile: '',
        email: '',
        gender: 'unknown',
        description: ''
      },
      formLabelWidth: '80px',
      rules: {
        name: [{ required: true, message: '请输入服务名称', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialog = val
        if (val) {
          this.resetForm()
          this.form.department_id = this.departmentId
          this.describeDepartment()
          this.$nextTick(() => {
            this.$refs['serviceForm'].clearValidate()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    describeDepartment() {
      if (this.departmentId) {
        this.departmentName = '加载中 ...'
        describeDepartment(this.departmentId).then(resp => {
          this.departmentName = resp.data.name
        })
      }
    },
    handleClose(done) {
      if (this.createNamespaceLoading) {
        return
      }
      this.createNamespaceLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    cancelForm() {
      this.createNamespaceLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    resetForm() {
      this.departmentName = ''
      this.form = {
        gender: 'unknown'
      }
    },
    submit() {
      this.$refs['serviceForm'].validate((valid) => {
        if (valid) {
          this.createNamespaceLoading = true
          createService(this.form).then(resp => {
            this.$refs.drawer.closeDrawer()
            this.$emit('update:visible', false)
            this.$emit('change', resp.data)
          }).finally(() => {
            this.createNamespaceLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.drawer-footer {
  text-align: center;
}

</style>>
