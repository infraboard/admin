<template>
  <div class="wrapper">
    <tips title="欢迎 xxx 登陆系统, 在使用之前, 请完善如下信息" />
    <div class="box-shadow" style="background-color: #fff;">
      <div>
        <el-steps :active="active" simple>
          <el-step title="个人信息" icon="el-icon-user-solid" />
          <el-step title="加入申请" icon="el-icon-s-cooperation" />
          <el-step title="注意事项" icon="el-icon-s-order" />
        </el-steps>
      </div>
      <div class="form-content">
        <el-divider />
        <div style="margin-top:24px;">
          <!-- profile form -->
          <el-form v-show="active === 0" ref="profileFormData" :rules="rules" label-position="left" :model="profileForm">
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="real_name">
              <el-input v-model="profileForm.real_name" maxlength="40" show-word-limit />
              <div class="input-tips">
                <span>用户真实姓名, 用于界面展示</span>
              </div>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
              <el-input v-model="profileForm.phone" maxlength="40" show-word-limit />
              <div class="input-tips">
                <span>电话号码将用于密码找回,消息通知和多因子认证</span>
              </div>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="profileForm.email" maxlength="60" show-word-limit />
              <div class="input-tips">
                <span>用于订阅站内消息</span>
              </div>
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
              <el-radio v-model="profileForm.gender" label="male">男</el-radio>
              <el-radio v-model="profileForm.gender" label="female">女</el-radio>
              <el-radio v-model="profileForm.gender" label="unknown">保密</el-radio>
            </el-form-item>
            <el-form-item label="语言" :label-width="formLabelWidth" prop="language">
              <el-select v-model="profileForm.language" placeholder="请选择">
                <el-option
                  v-for="item in languageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <!-- department -->
          <el-form v-show="active === 1" ref="departFormData" :rules="dprules" label-position="left" :model="departForm">
            <el-form-item label="部门" :label-width="formLabelWidth" prop="department_id">
              <choice-department :department.sync="departForm.department_id" />
              <div class="input-tips">
                <span>选择需要申请加入的部门</span>
              </div>
            </el-form-item>
            <el-form-item label="留言" :label-width="formLabelWidth" prop="message">
              <el-input v-model="departForm.message" maxlength="200" type="textarea" show-word-limit />
              <div class="input-tips">
                <span>如果有啥备注请写这里吧</span>
              </div>
            </el-form-item>
          </el-form>
          <!-- review -->
          <div v-show="active === 2" class="tips-content">
            <li v-for="(item, i) in tips" :key="i">{{ item }}</li>
          </div>
        </div>

        <div>
          <div>
            <el-button :disabled="active === 0" @click="previous">上一步</el-button>
            <el-button v-if="active < 2" type="primary" @click="next">下一步</el-button>
            <el-button v-if="active === 2" type="primary" style="width:68px;" @click="submit">完 成</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { updateProfile } from '@/api/keyauth/profile'
import { joinDepartment } from '@/api/keyauth/department'
import ChoiceDepartment from '@/components/ChoiceDepartment'
import Tips from '@/components/Tips'

const tips = [
  '点击完成后, 加入申请就会提交, 请及时联系部门负责人处理'
]

const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' }
]

export default {
  name: 'UserInitial',
  components: { Tips, ChoiceDepartment },
  data() {
    return {
      tips,
      languageOptions,
      active: 0,
      formLabelWidth: '50px',
      profileForm: {
        phone: '',
        email: '',
        gender: 'unknown',
        language: 'zh',
        is_initialized: true
      },
      departForm: {
        department_id: ''
      },
      rules: {
        real_name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'change' }]
      },
      dprules: {
        department_id: [{ required: true, message: '请选择申请加入的部门', trigger: 'change' }]
      }
    }
  },
  methods: {
    next() {
      switch (this.active) {
        case 0:
          this.$refs['profileFormData'].validate((valid) => {
            if (valid) {
              this.active++
            }
          })
          break
        case 1:
          this.$refs['departFormData'].validate((valid) => {
            if (valid) {
              this.active++
            }
          })
          break
        case 2:
          console.log('2')
          break
      }
    },
    previous() {
      if (this.active-- < 0) this.active = 0
    },
    async submit() {
      var upResp = await updateProfile(this.profileForm)
      console.log(upResp)
      var jdResp = await joinDepartment(this.departForm)
      console.log(jdResp)
      // 调转到首页
      this.$router.push({ path: '/' })
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
