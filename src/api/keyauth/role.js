import request from '@/utils/request'

export function queryRoles(query) {
  return request({
    url: '/keyauth/v1/roles',
    method: 'get',
    params: query
  })
}
