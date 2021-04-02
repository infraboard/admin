<template>
  <div class="app-container wrapper">
    <div class="box-shadow" style="background-color: #fff;">
      <div>
        <el-steps :active="active" simple>
          <el-step title="选择服务" icon="el-icon-menu" />
          <el-step title="资源授权" icon="el-icon-s-claim" />
          <el-step title="权限审阅" icon="el-icon-s-check" />
        </el-steps>
      </div>
      <div class="form-content">
        <el-divider />
        <div style="margin-top:24px;margin-bottom:12px;">
          <!-- choice service -->
          <div>
            <el-checkbox-group v-show="active === 0" v-model="choicedService" @change="choicedServiceChanged">
              <el-checkbox v-for="options in serviceOptions" :key="options.id" :label="options">
                <span>{{ options.description }} ({{ options.name }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- perm -->
          <div v-show="active === 1">
            <div v-for="svr in choicedService" :key="svr.id">
              <div style="margin-bottom:12px;">
                <span class="f12"> {{ svr.description }} ({{ svr.name }})</span>
              </div>
              <el-table
                v-loading="listLoading"
                border
                :data="svr.resourceOptions"
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
                    <el-checkbox v-for="ac in generateActionOptions(scope.row)" :key="ac.id" v-model="choicePerm" :label="ac.id" @change="choicePermChanged">{{ ac.operation }}</el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-show="active === 2">
            <el-form ref="createFormData" :rules="rules" label-position="left" :model="createForm">
              <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="createForm.name" maxlength="40" show-word-limit />
                <div class="input-tips">
                  <span>推荐直接使用中文</span>
                </div>
              </el-form-item>
              <el-form-item label="角色描述" :label-width="formLabelWidth" prop="description">
                <el-input
                  v-model="createForm.description"
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  maxlength="200"
                  show-word-limit
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="权限列表" :label-width="formLabelWidth">
                <el-table
                  border
                  :data="choicedService"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="服务名称"
                    width="180"
                  />
                  <el-table-column
                    label="授权条目"
                  >
                    <template slot-scope="scope">
                      <li v-for="item in scope.row.resources" :key="item.resource" style="display: flex">
                        <div style="width:120px;">{{ item.resource }}</div>
                        <div>{{ item.actions.join(' ') }}</div>
                      </li>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div>
          <div>
            <el-button :disabled="active === 0" @click="previous">上一步</el-button>
            <el-button v-if="active < 2" type="primary" :disabled="disableNext" @click="next">下一步</el-button>
            <el-button v-if="active === 2" type="primary" :loading="createRoleLoading" style="width:68px;" @click="submit">完 成</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { listResource, createRole } from '@/api/keyauth/role'
import { queryService } from '@/api/keyauth/service'

export default {
  name: 'UserInitial',
  components: { },
  data() {
    return {
      createRoleLoading: false,
      listLoading: false,
      service: [],
      disableNext: true,
      choicedService: [],
      serviceOptions: [],
      choicePerm: [],
      createForm: {
        name: '',
        description: '',
        permissions: []
      },
      active: 0,
      formLabelWidth: '80px',
      rules: {
        name: [{ required: true, message: '请输入需要创建的角色名称', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.listService()
  },
  methods: {
    async listService() {
      var resp = await queryService()
      this.serviceOptions = resp.data.items
    },
    choicedServiceChanged() {
      if (this.choicedService.length > 0) {
        this.disableNext = false
      } else {
        this.disableNext = true
      }
    },
    async listResourceOptions() {
      // 构建查询参数
      var service_ids = []
      this.choicedService.forEach(item => {
        service_ids.push(item.id)
      })

      // 查询所有服务的资源列表
      var resp = await listResource({ service_ids: service_ids.join(','), permission_enable: true })
      var svrResource = new Map()
      resp.data.items.forEach(item => {
        if (!svrResource.has(item.service_id)) {
          svrResource.set(item.service_id, [])
        }
        svrResource.get(item.service_id).push(item)
      })

      // 被选择的服务添加资源列表
      this.choicedService.forEach(item => {
        item.resourceOptions = svrResource.get(item.id)
      })
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
    choicePermChanged() {
      if (this.choicePerm.length > 0) {
        this.disableNext = false
      } else {
        this.disableNext = true
      }
    },
    generateChoicePermtoService() {
      this.choicedService.forEach(svr => {
        var rns = []
        var acs = []

        this.choicePerm.forEach(item => {
          var choiced = item.split(',')
          var sid = choiced[0]
          var rn = choiced[1]
          var ac = choiced[2]

          if (sid === svr.id) {
            var rnIndex = rns.indexOf(rn)
            if (rnIndex !== -1) {
              acs[rnIndex].push(ac)
            } else {
              rns.push(rn)
              acs.push([ac])
            }
          }
        })

        var resources = []
        for (const i in rns) {
          resources.push({
            resource: rns[i],
            actions: acs[i]
          })
        }
        svr.resources = resources
      })
    },
    async next() {
      switch (this.active) {
        case 0:
          if (this.choicedService.length > 0) {
            if (this.choicePerm.length === 0) {
              this.disableNext = true
            }
            this.active++
            this.listLoading = true
            await this.listResourceOptions()
            this.listLoading = false
          }
          break
        case 1:
          if (this.choicePerm.length > 0) {
            this.active++
            this.generateChoicePermtoService()
          }
          break
        case 2:
          break
      }
    },
    previous() {
      if (this.active-- < 0) this.active = 0
    },
    async submit() {
      this.$refs['createFormData'].validate(async(valid) => {
        if (valid) {
          // 生成参数
          this.choicedService.forEach(svr => {
            svr.resources.forEach(item => {
              this.createForm.permissions.push({
                'effect': 'allow',
                'service_id': svr.id,
                'resource_name': item.resource,
                'label_key': 'action',
                'label_values': item.actions
              })
            })
          })

          // 创建角色
          this.createRoleLoading = true
          try {
            await createRole(this.createForm)
            // 调转到角色列表
            this.$router.push({ path: '/permission/role' })
          } finally {
            this.createRoleLoading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  padding: 0px 24px 24px 24px;
}

.tips-content {
    padding: 0px 0px 10px 0px;
    font-size: 12px;
    color: #303133;
}

.wrapper ::v-deep .el-steps--simple {
  background: #fff;
}

.wrapper ::v-deep .el-step__title {
  font-size: 14px;
}

.wrapper ::v-deep .el-divider--horizontal {
  margin: 2px 0px;
}

</style>
