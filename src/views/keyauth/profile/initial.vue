<template>
  <div class="app-container">
    <tips title="欢迎 xxx 登陆系统, 在使用之前, 请完善如下信息" />
    <div class="box-shadow" style="background-color: #fff;">
      <div>
        <el-steps :active="active" simple>
          <el-step title="个人信息" icon="el-icon-user-solid" />
          <el-step title="部门信息" icon="el-icon-s-cooperation" />
          <el-step title="审阅" icon="el-icon-s-order" />
        </el-steps>
      </div>
      <div class="form-content">
        <el-divider />
        <el-form label-width="80px" :rules="rules" label-position="left" :model="profileForm" style="margin-top:24px;">
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="profileForm.mobile" maxlength="40" show-word-limit />
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
          <div>
            <el-button :disabled="active === 0" @click="previous">上一步</el-button>
            <el-button v-if="active < 2" type="primary" @click="next">下一步</el-button>
            <el-button v-if="active === 2" type="primary" style="width:68px;" @click="next">完 成</el-button>
          </div>
        </el-form>

      </div>

    </div>
  </div>
</template>

<script>
import Tips from '@/components/Tips'

export default {
  name: 'DashboardEditor',
  components: { Tips },
  data() {
    return {
      active: 0,
      formLabelWidth: '50px',
      profileForm: {
        mobile: '',
        email: '',
        gender: 'unknown'
      },
      departForm: {},
      rules: {
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 2
    },
    previous() {
      if (this.active-- < 0) this.active = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  padding: 0px 24px 24px 24px;
}

.app-container ::v-deep .el-steps--simple {
  background: #fff;
}

.app-container ::v-deep .el-step__title {
  font-size: 14px;
}

.app-container ::v-deep .el-divider--horizontal {
  margin: 2px 0px;
}

</style>
