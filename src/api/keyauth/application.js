import request from '@/utils/request'

export function queryApplication(query) {
  return request({
    url: '/keyauth/v1/applications',
    method: 'get',
    params: query
  })
}

export function createApplication(data) {
  return request({
    url: '/keyauth/v1/applications/',
    method: 'post',
    data
  })
}

export function deleteApplication(id, query) {
  return request({
    url: '/keyauth/v1/applications/' + id,
    method: 'delete',
    params: query
  })
}
