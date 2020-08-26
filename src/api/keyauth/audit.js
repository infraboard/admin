import request from '@/utils/request'

export function queryLoginLog(query) {
  return request({
    url: '/keyauth/v1/loginLogs',
    method: 'get',
    params: query
  })
}
