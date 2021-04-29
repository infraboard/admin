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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row type="flex" justify="space-around">
              <el-col :span="6">
                <el-form label-position="left" inline>
                  <el-form-item label="事件ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                </el-form>
                <el-form label-position="left" inline>
                  <el-form-item label="事件来源">
                    <span>{{ props.row.header.source }}[{{ props.row.header.meta.host }}]</span>
                  </el-form-item>
                </el-form>
                <el-form label-position="left" inline>
                  <el-form-item label="事件等级">
                    <span>{{ props.row.header.level }}</span>
                  </el-form-item>
                </el-form>
                <el-form label-position="left" inline>
                  <el-button type="text" @click="handleShowEventJson(props.row)">查看事件</el-button>
                </el-form>
              </el-col>
              <el-col :span="6">
                <el-form label-position="left" inline>
                  <el-form-item label="请求ID">
                    <span>{{ props.row.header.request_id }}</span>
                  </el-form-item>
                </el-form>
                <el-form label-position="left" inline>
                  <el-form-item label="会话ID">
                    <span>{{ props.row.body.session }}</span>
                  </el-form-item>
                </el-form>
                <el-form label-position="left" inline>
                  <el-form-item label="用户类型">
                    <span>{{ props.row.body.user_type }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="6">
                <el-form label-position="left" inline>
                  <el-form-item label="操作IP">
                    <span>{{ props.row.header.ip_address }}</span>
                  </el-form-item>
                </el-form>
                <el-form label-position="left" inline>
                  <el-form-item label="操作UA">
                    <span>{{ props.row.header.user_agent }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="事件时间" prop="name" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.header.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户" min-width="150px" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.body.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作资源" prop="type" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.body.resource_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作动作" prop="description" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.body.action }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作耗时" prop="description" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.body.cost }}ms</span>
          </template>
        </el-table-column>
        <el-table-column label="接口路径" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.body.feature_path }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getLoginLogList" />
      <event-show-drawer :visible.sync="eventShowVisible" :event="showJsonData" />
    </div>
  </div>
</template>

<script>
import { queryEvent } from '@/api/eventbox/event'
import Pagination from '@/components/Pagination'
import DateTimePicker from '@/components/DateTimePicker'
import Tips from '@/components/Tips'
import EventShowDrawer from '@/components/EventShowDrawer'

const tips = [
  '操作日志记录了“谁”在“什么时间”、“什么地点”，对“哪个资源”做了“什么操作”'
]

export default {
  name: 'OperateLog',
  components: { Pagination, DateTimePicker, Tips, EventShowDrawer },
  directives: { },
  data() {
    return {
      eventShowVisible: false,
      showJsonData: '',
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
    handleShowEventJson(data) {
      var d = JSON.parse(JSON.stringify(data))
      d.body.request = JSON.parse(data.body.request)
      d.body.response = JSON.parse(data.body.response)
      this.showJsonData = JSON.stringify(d, null, '\t')
      this.eventShowVisible = true
    },
    resetQuery() {
      this.listQuery = {}
    },
    getLoginLogList() {
      this.listLoading = true
      // 获取用户列表
      queryEvent(this.listQuery).then(resp => {
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
  .app-container ::v-deep .el-form-item__label {
    font-size: 12px;
  }
  .app-container ::v-deep .el-form-item__content {
    font-size: 12px;
  }
</style>
