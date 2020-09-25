import request from '@/utils/request'

export function queryPolicy(query) {
  return request({
    url: '/keyauth/v1/policies/',
    method: 'get',
    params: query
  })
}

export function createPolicy(data) {
  return request({
    url: '/keyauth/v1/policies/',
    method: 'post',
    data
  })
}
