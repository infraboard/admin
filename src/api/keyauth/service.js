import request from '@/utils/request'

export function queryService(query) {
  return request({
    url: '/keyauth/v1/services',
    method: 'get',
    params: query
  })
}

export function describeService(id, query) {
  return request({
    url: '/keyauth/v1/services/' + id,
    method: 'get',
    params: query
  })
}

export function refreshServiceClientSecret(id, data) {
  return request({
    url: '/keyauth/v1/services/' + id + '/refresh_client_secret',
    method: 'post',
    data
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
