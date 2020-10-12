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

export function describeServiceToken(id, query) {
  return request({
    url: '/keyauth/v1/services/' + id + '/token',
    method: 'get',
    params: query
  })
}

export function refreshServiceToken(id, data) {
  return request({
    url: '/keyauth/v1/services/' + id + '/token',
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
