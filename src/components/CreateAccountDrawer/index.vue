<template>
  <el-drawer
    ref="drawer"
    title="新增用户"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="32%"
  >
    <div class="drawer-content">
      <el-form ref="userForm" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="部门" prop="department_id">
          <choice-department v-if="!departmentId" :department.sync="form.department_id" />
          <el-input v-else v-model="departmentName" disabled />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="account">
          <el-input v-model="form.account" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" show-password />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <el-radio v-model="form.gender" label="male">男</el-radio>
          <el-radio v-model="form.gender" label="female">女</el-radio>
          <el-radio v-model="form.gender" label="unknown">保密</el-radio>
        </el-form-item>
        <el-form-item label="过期时间" :label-width="formLabelWidth">
          <el-checkbox v-model="neverExpire">永不过期</el-checkbox>
        </el-form-item>
        <el-form-item v-show="!neverExpire" :label-width="formLabelWidth">
          <el-date-picker
            v-model="expireDatetime"
            style="width:100%"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions"
          />
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
        <el-button type="primary" :loading="createAccountLoading" @click="submit">{{ createAccountLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { createSubAccount } from '@/api/keyauth/subAccount'
import ChoiceDepartment from '@/components/ChoiceDepartment'
import { describeDepartment } from '@/api/keyauth/department'

export default {
  name: 'CreateAccountDrawer',
  components: { ChoiceDepartment },
  props: {
    visible: {
      default: false,
      type: Boolean
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
      createAccountLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一月',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '一年',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
            picker.$emit('pick', date)
          }
        }]
      },
      neverExpire: true,
      expireDatetime: '',
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
        department_id: [{ required: true, message: '请选择用户部门', trigger: 'change' }],
        account: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'change' }],
        mobile: [{ required: true, message: '请输入用户电话号码', trigger: 'change' }],
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'change' }]
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
            this.$refs['userForm'].clearValidate()
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
      if (this.createAccountLoading) {
        return
      }
      this.createAccountLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    cancelForm() {
      this.createAccountLoading = false
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
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.createAccountLoading = true
          createSubAccount(this.form).then(resp => {
            this.$refs.drawer.closeDrawer()
            this.$emit('update:visible', false)
            this.$emit('change', resp.data)
          }).finally(() => {
            this.createAccountLoading = false
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
