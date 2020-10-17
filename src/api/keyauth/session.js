import request from '@/utils/request'

export function queryLoginLog(query) {
  return request({
    url: '/keyauth/v1/sessions',
    method: 'get',
    params: query
  })
}
