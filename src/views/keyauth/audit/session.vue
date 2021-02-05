<template>
  <div class="app-container">
    <div>
      <tips :tips="tips" />
    </div>
    <div class="filter-container">
      <div class="filter-item">
        <el-input v-model="filterValue" class="input-with-select filter-search-input" clearable placeholder="按回车进行搜索" @clear="clearSearch" @keyup.enter.native="handleSearch">
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="用户" value="account" />
            <el-option label="登录IP" value="login_ip" />
            <el-option label="登录城市" value="login_city" />
            <el-option label="授权方式" value="grant_type" />
          </el-select>
        </el-input>
      </div>

      <div class="filter-item" style="margin-left:8px;">
        <date-time-picker :choiced-time.sync="choicedTime" @change="choicedTimeChanged" />
      </div>

    </div>
    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="roleList"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="用户" prop="name" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录时间/退出时间" min-width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.login_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span><br>
            <span>{{ row.logout_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会话时长" prop="type" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.logout_at">{{ (row.logout_at - row.login_at) | formatDuration }} </span>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column label="应用名称/授权方式" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.application_name }}</span><br>
            <span>{{ row.grant_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录IP" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.login_ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录地点" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.ip_info">{{ row.ip_info.country }} {{ row.ip_info.isp }}</span> <br>
            <span v-if="row.ip_info">{{ row.ip_info.province }} {{ row.ip_info.city }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作系统" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.user_agent">{{ row.user_agent.os }}</span> <br>
            <span v-if="row.user_agent">{{ row.user_agent.platform }}</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览器" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span v-if="row.user_agent">{{ row.user_agent.browser_name }}</span> <br>
            <span v-if="row.user_agent">{{ row.user_agent.browser_version }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getLoginLogList" />
    </div>
  </div>
</template>

<script>
import { queryLoginLog } from '@/api/keyauth/session'
import Pagination from '@/components/Pagination'
import DateTimePicker from '@/components/DateTimePicker'
import Tips from '@/components/Tips'

const tips = [
  '移动端登录，由于运营商是随机分配IP，往往存在与实际登录地不符的情况',
  '若使用VPN或代理联网的，登录地点无法准确记录',
  '部分网络代理商的服务，存在IP地址不稳定的问题'
]

export default {
  name: 'LoginLog',
  components: { Pagination, DateTimePicker, Tips },
  directives: { },
  data() {
    return {
      tips,
      filterKey: 'account',
      filterValue: '',
      tableKey: 0,
      roleList: [],
      total: 0,
      listLoading: false,
      choicedTime: [],
      listQuery: {
        account: '',
        application_id: '',
        login_ip: '',
        login_city: '',
        grant_type: '',
        start_time: 0,
        end_time: 0,
        page_number: 1,
        page_size: 20
      }
    }
  },
  created() {
    this.getLoginLogList()
  },
  methods: {
    resetQuery() {
      this.listQuery = {}
    },
    getLoginLogList() {
      this.listLoading = true
      // 获取用户列表
      queryLoginLog(this.listQuery).then(resp => {
        this.roleList = resp.data.items
        this.total = resp.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    choicedTimeChanged(val) {
      if (Array.isArray(val) && val.length === 2) {
        this.listQuery.start_time = val[0].getTime()
        this.listQuery.end_time = val[1].getTime()
      } else {
        this.listQuery.start_time = 0
        this.listQuery.end_time = 0
      }
      this.getLoginLogList()
    },
    handleSearch() {
      switch (this.filterKey) {
        case 'account':
          this.listQuery.account = this.filterValue
          break
        case 'login_ip':
          this.listQuery.login_ip = this.filterValue
          break
        case 'login_city':
          this.listQuery.login_city = this.filterValue
          break
        case 'grant_type':
          this.listQuery.grant_type = this.filterValue
          break
      }
      this.getLoginLogList()
    },
    clearSearch() {
      this.resetQuery()
      this.getLoginLogList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container ::v-deep .el-select {
    width: 102px;
  }
  .app-container ::v-deep .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
