import request from '@/utils/request'

export function queryPolicy(query) {
  return request({
    url: '/keyauth/v1/policies/',
    method: 'get',
    params: query
  })
}
