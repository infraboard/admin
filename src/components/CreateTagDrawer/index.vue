<template>
  <el-drawer
    ref="drawer"
    :title="title"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    size="60%"
  >
    <div class="drawer-content">
      <el-form ref="TagForm" :model="form" :rules="rules">
        <el-form-item label="访问范围" :label-width="formLabelWidth" prop="scope_type">
          <el-radio-group v-model="form.scope_type">
            <el-radio-button label="global">全局</el-radio-button>
            <el-radio-button label="domain">域内</el-radio-button>
            <el-radio-button label="namespace">空间内</el-radio-button>
          </el-radio-group>
          <div class="input-tips">
            <span>全局/域内: 所有空间都可以查询到这个Tag, 空间内: 只有对应空间可以查询到该Tag</span>
          </div>
        </el-form-item>
        <el-form-item v-if="form.scope_type === 'namespace'" label="所属空间" :label-width="formLabelWidth" prop="namespace_id">
          <el-input v-model="form.namespace_id" maxlength="60" show-word-limit />
          <div class="input-tips">
            <span>标签只属于该空间, 只有该空间才能访问到这个标签</span>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="标签名称" prop="key_name">
          <el-input v-model="form.key_name" maxlength="100" show-word-limit />
          <div class="input-tips">
            <span>标签名称及key的名称, 不可以修改, 请谨慎命名</span>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="显示名称" prop="key_label">
          <el-input v-model="form.key_label" maxlength="200" show-word-limit />
          <div class="input-tips">
            <span>标签的中文显示, 也就是别名</span>
          </div>
        </el-form-item>
        <el-form-item label="值来源" :label-width="formLabelWidth" prop="value_from">
          <el-radio-group v-model="form.value_from">
            <el-radio-button label="MANUAL">手动录入</el-radio-button>
            <el-radio-button label="HTTP">HTTP 远程获取</el-radio-button>
          </el-radio-group>
          <div class="input-tips">
            <span>全局/域内: 所有空间都可以查询到这个Tag, 空间内: 只有对应空间可以查询到该Tag</span>
          </div>
        </el-form-item>
        <div v-if="form.value_from === 'HTTP'">
          <el-form-item :label-width="formLabelWidth" label="URL" prop="http_from_option.url">
            <el-input v-model="form.http_from_option.url" maxlength="200" show-word-limit />
            <div class="input-tips">
              <span>HTTP 远程调用的URL, 注意只支持GET方法</span>
            </div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="Header" prop="http_from_option.headers">
            <el-input v-model="form.http_from_option.headers" maxlength="200" show-word-limit />
            <div class="input-tips">
              <span>HTTP Header, 格式key1=value1,key2=value2</span>
            </div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="搜索关键字" prop="http_from_option.search_key">
            <el-input v-model="form.http_from_option.search_key" maxlength="100" show-word-limit />
            <div class="input-tips">
              <span>当使用关键字进行搜索时, 关键字参数的Key名称</span>
            </div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="值属性" prop="http_from_option.value_key">
            <el-input v-model="form.http_from_option.value_key" maxlength="100" show-word-limit />
            <div class="input-tips">
              <span>值对应的属性路径, 比如json为[{'value': 'v1'}], 对应的值属性就为value</span>
            </div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="值显示属性" prop="http_from_option.label_key">
            <el-input v-model="form.http_from_option.label_key" maxlength="100" show-word-limit />
            <div class="input-tips">
              <span>显示对应的属性路径, 比如json为[{'display_name': 'name'}], 对应的值属性就为name</span>
            </div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="值描述属性" prop="http_from_option.desc_key">
            <el-input v-model="form.http_from_option.desc_key" maxlength="100" show-word-limit />
            <div class="input-tips">
              <span>描述对应的属性路径, 比如json为[{'desc': 'desc ...'}], 对应的值属性就为desc</span>
            </div>
          </el-form-item>
        </div>
        <div v-else-if="form.value_from === 'MANUAL'">
          <el-form-item :label-width="formLabelWidth" label="">
            <el-button type="primary" icon="el-icon-plus" @click="addValue">添加值</el-button>
            <el-table
              :data="form.values"
              stripe
              empty-text=""
              style="width: 100%"
            >
              <el-table-column label="名称" width="120px" align="center">
                <template slot-scope="{row}">
                  <el-input v-model="row.value" />
                </template>
              </el-table-column>
              <el-table-column label="别名" width="160px" align="center">
                <template slot-scope="{row}">
                  <el-input v-model="row.label" />
                </template>
              </el-table-column>
              <el-table-column label="描述" align="center">
                <template slot-scope="{row}">
                  <el-input v-model="row.desc" />
                </template>
              </el-table-column>
              <el-table-column label="" width="60px" align="center">
                <template slot-scope="{row,$index}">
                  <el-button type="text" icon="el-icon-delete" @click="deleteValue(row,$index)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="key_desc">
          <el-input
            v-model="form.key_desc"
            type="textarea"
            :autosize="{ minRows: 4}"
            maxlength="400"
            show-word-limit
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" :loading="createTagLoading" @click="submit">{{ createTagLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { createTag } from '@/api/keyauth/tag'
import { describeDepartment } from '@/api/keyauth/department'

export default {
  name: 'CreateTagDrawer',
  components: { },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '新增标签',
      type: String
    },
    namespaceId: {
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
      createTagLoading: false,
      form: {
        scope_type: '',
        key_name: '',
        key_label: '',
        key_desc: '',
        namespace_id: '',
        value_from: 'MANUAL',
        http_from_option: {},
        values: []
      },
      formLabelWidth: '100px',
      rules: {
        scope_type: [{ required: true, message: '请选择标签被访问的范围', trigger: 'change' }],
        key_name: [{ required: true, message: '请输入标签建的名称', trigger: 'change' }],
        namespace_id: [{ required: true, message: '请选择用户部门', trigger: 'change' }],
        value_from: [{ required: true, message: '请选择标签值的来源', trigger: 'change' }],
        'http_from_option.url': [{ required: true, message: '请选择标签值的来源', trigger: 'change' }],
        'http_from_option.value_key': [{ required: true, message: '请输入值属性的名称', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialog = val
        if (val) {
          this.resetForm()
          this.form.namespace_id = this.namespaceId
          this.describeDepartment()
          this.$nextTick(() => {
            this.$refs['TagForm'].clearValidate()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    describeDepartment() {
      if (this.namespaceId) {
        this.departmentName = '加载中 ...'
        describeDepartment(this.namespaceId).then(resp => {
          this.departmentName = resp.data.name
        })
      }
    },
    handleClose(done) {
      if (this.createTagLoading) {
        return
      }
      this.createTagLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    cancelForm() {
      this.createTagLoading = false
      this.dialog = false
      this.$emit('update:visible', false)
    },
    resetForm() {
      this.form = {
        scope_type: '',
        key_name: '',
        key_label: '',
        key_desc: '',
        namespace_id: '',
        value_from: 'MANUAL',
        http_from_option: {},
        values: []
      }
    },
    addValue() {
      this.form.values.push({
        value: '',
        label: '',
        desc: ''
      })
    },
    deleteValue(row, index) {
      this.form.values.splice(index, 1)
    },
    submit() {
      this.$refs['TagForm'].validate((valid) => {
        if (valid) {
          this.createTagLoading = true
          createTag(this.form).then(resp => {
            this.$notify({
              message: `创建标签[${resp.data.key_name}]成功`,
              customClass: 'notify-success'
            })
            this.$refs.drawer.closeDrawer()
            this.$emit('update:visible', false)
            this.$emit('change', resp.data)
          }).finally(() => {
            this.createTagLoading = false
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
