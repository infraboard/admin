<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- 错误日志 -->
        <error-log class="right-menu-item" />
        <!-- 全屏插件 -->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!-- 尺寸控制 -->
        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <!-- 语言选择 -->
        <lang-select class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <el-button type="text">
          <img v-if="avatar" :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span v-else class="text-avatar">{{ name[0].toLocaleUpperCase() }}</span>
          <span class="user-name-text">{{ name }}</span>
          <i class="el-icon-arrow-down el-icon--right dropdown-color" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              <svg-icon icon-class="person" />
              <span class="dropdown-item-text">{{ $t('navbar.profile') }}</span>
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/infraboard/keyauth">
            <el-dropdown-item>
              <svg-icon icon-class="github" />
              <span class="dropdown-item-text">{{ $t('navbar.github') }}</span>
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
  }
}

.user-avatar {
    display: inline-block;
    overflow: hidden;
    line-height: 20;
    vertical-align: middle;
    border-radius: 50%!important;
    width: 25px;
    height: 25px;
    margin-bottom: 6px;
  }

.el-dropdown-link {
    cursor: pointer;
    color: #888
  }

.el-icon-arrow-down {
    font-size: 12px;
  }

.user-name-text {
  margin-left: 4px;
  color: #5a5e66
}

.dropdown-color {
    color: #5a5e66
}

.dropdown-item-text {
  margin-left: 12px;
  margin-right: 12px;
}

.text-avatar {
  font-size: 14px;
  font-weight: 600;
}

</style>
