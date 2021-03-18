<template>
  <el-drawer
    ref="drawer"
    :title="title"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="40%"
  >
    <div class="drawer-content">
      <el-form ref="permissionFrom" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="授权服务" prop="service_id">
          <el-select
            v-model="form.service_id"
            style="width:100%"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请选择需要授权的服务"
            :loading="queryServiceLoading"
            @change="handleChoiceServiceChanged"
          >
            <el-option
              v-for="item in serviceOptions"
              :key="item.id"
              :label="`${item.description}(${item.name})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.service_id" label="授权资源" :label-width="formLabelWidth" prop="choice_perm">
          <el-table
            v-loading="queryResourceLoading"
            border
            :data="resourceOptions"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="资源名称"
              width="180"
            />
            <el-table-column
              label="操作方法"
            >
              <template slot-scope="scope">
                <el-checkbox v-for="ac in generateActionOptions(scope.row)" :key="ac.id" v-model="form.choice_perm" :label="ac.id">{{ ac.operation }}</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="addPermissionLoading" @click="submit">{{ addPermissionLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { queryService } from '@/api/keyauth/service'
import { listResource, addPermissionToRole } from '@/api/keyauth/role'

export default {
  name: 'UpdatePermissionDrawer',
  components: { },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '添加权限',
      type: String
    },
    roleId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      queryServiceLoading: false,
      serviceOptions: [],
      queryResourceLoading: false,
      resourceOptions: [],

      table: false,
      dialog: false,
      addPermissionLoading: false,
      form: {
        service_id: '',
        choice_perm: []
      },
      addPermRequest: {
        permissions: []
      },
      formLabelWidth: '80px',
      rules: {
        service_id: [{ required: true, message: '请选择需要授权的服务', trigger: 'change' }],
        choice_perm: [{ required: true, message: '请选择需要授权的资源', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialog = val
        if (val) {
          this.resetForm()
          this.$nextTick(() => {
            this.$refs['permissionFrom'].clearValidate()
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.listService()
  },
  methods: {
    async listService() {
      this.queryServiceLoading = true
      try {
        var resp = await queryService()
        this.serviceOptions = resp.data.items
      } finally {
        this.queryServiceLoading = false
      }
    },
    async handleChoiceServiceChanged(val) {
      // 查询所有服务的资源列表
      this.queryResourceLoading = true
      try {
        var resp = await listResource({ service_ids: val, permission_enable: true })
        this.resourceOptions = resp.data.items
      } finally {
        this.queryResourceLoading = false
      }
    },
    generateActionOptions(resource) {
      var actions = []
      if (resource.actions) {
        resource.actions.forEach(item => {
          actions.push({
            operation: item,
            id: `${resource.service_id},${resource.name},${item}`
          })
        })
      }

      return actions
    },
    generateChoicePermtoService(choicePerm) {
      var sid = ''
      var rns = []
      var acs = []

      choicePerm.forEach(item => {
        var choiced = item.split(',')
        sid = choiced[0]
        var rn = choiced[1]
        var ac = choiced[2]

        var rnIndex = rns.indexOf(rn)
        if (rnIndex !== -1) {
          acs[rnIndex].push(ac)
        } else {
          rns.push(rn)
          acs.push([ac])
        }
      })

      var resources = []
      for (const i in rns) {
        resources.push({
          service_id: sid,
          resource: rns[i],
          actions: acs[i]
        })
      }

      return resources
    },
    handleClose(done) {
      if (this.addPermissionLoading) {
        return
      }
      this.addPermissionLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    cancelForm() {
      this.addPermissionLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    resetForm() {
      this.resourceOptions = []
      this.form = {
        service_id: '',
        choice_perm: []
      }
    },
    submit() {
      this.$refs['permissionFrom'].validate((valid) => {
        if (valid) {
          this.addPermissionLoading = true
          this.addPermRequest.permissions = []
          var resources = this.generateChoicePermtoService(this.form.choice_perm)
          resources.forEach(item => {
            this.addPermRequest.permissions.push({
              'effect': 'allow',
              'service_id': item.service_id,
              'resource_name': item.resource,
              'label_key': 'action',
              'label_values': item.actions
            })
          })
          addPermissionToRole(this.roleId, this.addPermRequest).then(resp => {
            this.$message({
              message: `添加权限成功`,
              type: 'success'
            })
            this.$refs.drawer.closeDrawer()
            this.$emit('update:visible', false)
            this.$emit('change', resp.data)
          }).finally(() => {
            this.addPermissionLoading = false
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

</style>
