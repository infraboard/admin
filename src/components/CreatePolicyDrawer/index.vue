<template>
  <el-drawer
    ref="drawer"
    title="创建策略"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="40%"
  >
    <div class="drawer-content">
      <el-form ref="policyForm" :model="form" :rules="rules">
        <el-form-item v-if="!namespaceId" label="空间" prop="namespace_id" :label-width="formLabelWidth">
          <el-select v-model="form.namespace_id" style="width:100%" placeholder="请选择授权空间" :loading="queryNamespaceLoading" @visible-change="showNamespaceList">
            <el-option
              v-for="item in namespaceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <div class="input-tips">
            <span>用户可以活动的范围</span>
          </div>
        </el-form-item>
        <el-form-item v-if="!account" label="用户" prop="account" :label-width="formLabelWidth">
          <el-select
            v-model="form.account"
            filterable
            remote
            reserve-keyword
            :remote-method="searchSubAccount"
            :loading="queryUserLoading"
            placeholder=""
            style="width:100%"
          >
            <el-option
              v-for="item in subAccountList"
              :key="item.account"
              :label="item.account"
              :value="item.account"
            >
              <span style="float: left">{{ item.account }}</span>
              <span v-if="item.department" style="float: right; color: #8492a6; font-size: 12px">{{ item.department.name }}</span>
              <span v-else style="float: right; color: #8492a6; font-size: 12px">无部门</span>
            </el-option>
          </el-select>
          <div class="input-tips">
            <span>请输入用户名,用户邮箱或者用户手机号码进行搜索</span>
          </div>
        </el-form-item>
        <el-form-item v-if="!roleId" label="角色" prop="role_id" :label-width="formLabelWidth">
          <el-select v-model="form.role_id" style="width:100%" placeholder="请选择授权角色" :loading="queryRoleLoading" @visible-change="showRoleList">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <div class="input-tips">
            <span>只能选择一个角色, 如果想授权更多功能, 请新建更强的角色</span>
          </div>
        </el-form-item>
        <el-form-item label="范围" :label-width="formLabelWidth">
          <choice-tag :tag-key.sync="scope_key" :tag-values.sync="scope_values" @change="handleTagChanged" />
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
      </el-form>
      <div class="drawer-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="createPolicyLoading" @click="submit">{{ createPolicyLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { queryRole } from '@/api/keyauth/role'
import { queryNamespace } from '@/api/keyauth/namespace'
import { querySubAccount } from '@/api/keyauth/subAccount'
import { createPolicy } from '@/api/keyauth/policy'
import ChoiceTag from '@/components/ChoiceTag'

export default {
  name: 'CreatePolicyDrawer',
  components: { ChoiceTag },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    namespaceId: {
      default: '',
      type: String
    },
    roleId: {
      default: '',
      type: String
    },
    account: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      scope_key: '',
      scope_values: [],
      subAccountQuery: { with_department: true },
      queryUserLoading: false,
      subAccountList: [],
      roleListQuery: {},
      queryRoleLoading: false,
      roleList: [],
      namespaceListQuery: {},
      queryNamespaceLoading: false,
      namespaceList: [],
      table: false,
      dialog: false,
      createPolicyLoading: false,
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
        namespace_id: '',
        account: '',
        role_id: ''
      },
      formLabelWidth: '80px',
      rules: {
        account: [{ required: true, message: '请选择用户', trigger: 'change' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        namespace_id: [{ required: true, message: '请选择空间', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialog = val
      },
      immediate: true
    }
  },
  methods: {
    handleTagChanged(val) {
      console.log(val)
      console.log(this.scope_key)
      console.log(this.scope_values)
    },
    searchSubAccount(keywords) {
      this.queryUserLoading = true
      // 获取用户列表
      this.subAccountQuery.keywords = keywords
      querySubAccount(this.subAccountQuery).then(response => {
        this.subAccountList = response.data.items
        this.queryUserLoading = false
      }).catch(() => {
        this.queryUserLoading = false
      })
    },
    showRoleList(visible) {
      if (visible && this.roleList.length === 0) {
        this.getRoleList()
      }
    },
    getRoleList() {
      this.queryRoleLoading = true
      // 获取用户列表
      queryRole(this.roleListQuery).then(response => {
        this.roleList = response.data.items
        this.queryRoleLoading = false
      }).catch(() => {
        this.queryRoleLoading = false
      })
    },
    showNamespaceList(visible) {
      if (visible && this.namespaceList.length === 0) {
        this.getNamespaceList()
      }
    },
    getNamespaceList() {
      this.queryNamespaceLoading = true
      // 获取用户列表
      queryNamespace(this.namespaceListQuery).then(response => {
        this.namespaceList = response.data.items
        this.queryNamespaceLoading = false
      }).catch(() => {
        this.queryNamespaceLoading = false
      })
    },
    handleClose(done) {
      if (this.createPolicyLoading) {
        return
      }
      this.createPolicyLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    cancelForm() {
      this.createPolicyLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    submit() {
      this.$refs['policyForm'].validate((valid) => {
        if (valid) {
          this.createPolicyLoading = true
          if (this.namespaceId) {
            this.form.namespace_id = this.namespaceId
          }
          if (this.account) {
            this.form.account = this.account
          }
          if (this.roleId) {
            this.form.role_id = this.roleId
          }
          if (this.scope_key && this.scope_values) {
            this.form.scope = `${this.scope_key}=${this.scope_values.join(',')}`
          }
          createPolicy(this.form).then(resp => {
            this.$notify({
              message: `添加策略成功`,
              customClass: 'notify-success'
            })
            this.$refs.drawer.closeDrawer()
            this.$emit('update:visible', false)
            this.$emit('change', resp.data)
          }).finally(() => {
            this.createPolicyLoading = false
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
