import request from '@/utils/request'

export function queryService(query) {
  return request({
    url: '/keyauth/v1/services',
    method: 'get',
    params: query
  })
}

export function createService(data) {
  return request({
    url: '/keyauth/v1/services/',
    method: 'post',
    data
  })
}

export function deleteService(id, query) {
  return request({
    url: '/keyauth/v1/services/' + id,
    method: 'delete',
    params: query
  })
}
