import request from '@/utils/request'

export function queryEndpoint(query) {
  return request({
    url: '/keyauth/v1/endpoints',
    method: 'get',
    params: query
  })
}
