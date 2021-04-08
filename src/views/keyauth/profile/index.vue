<template>
  <div class="market_out">
    <div v-if="user">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="账号资料" name="profile">
          <user-card :user="user" />
        </el-tab-pane>
        <el-tab-pane lazy label="访问凭证" name="activity">
          <access-token />
        </el-tab-pane>
        <el-tab-pane label="登录日志" name="timeline">
          <timeline />
        </el-tab-pane>
        <el-tab-pane label="账号安全" name="account">
          <account :user="user" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'
import AccessToken from './components/AccessToken'
export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account, AccessToken },
  data() {
    return {
      user: {},
      activeTab: 'profile'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .market_out ::v-deep .el-tabs__nav-wrap {
    padding: 0px 0px 0px 25px;
}
</style>
