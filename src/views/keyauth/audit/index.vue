<template>
  <div class="app-container">
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
            <span>{{ row.country }} {{ row.isp }}</span> <br>
            <span>{{ row.province }} {{ row.city }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作系统" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.os }}</span> <br>
            <span>{{ row.platform }}</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览器" prop="description" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.browser_name }}</span> <br>
            <span>{{ row.browser_version }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_number" :limit.sync="listQuery.page_size" @pagination="getLoginLogList" />
    </div>
  </div>
</template>

<script>
import { queryLoginLog } from '@/api/keyauth/audit'
import Pagination from '@/components/Pagination'

export default {
  name: 'LoginLog',
  components: { Pagination },
  directives: { },
  data() {
    return {
      tableKey: 0,
      roleList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page_number: 1,
        page_size: 10
      }
    }
  },
  created() {
    this.getLoginLogList()
  },
  methods: {
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
    }
  }
}
</script>
