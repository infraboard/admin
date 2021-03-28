import request from '@/utils/request'

export function queryTag(query) {
  return request({
    url: '/keyauth/v1/tags',
    method: 'get',
    params: query
  })
}

export function queryTagValue(tagId, query) {
  return request({
    url: '/keyauth/v1/tags/' + tagId + '/values',
    method: 'get',
    params: query
  })
}

export function describeTag(id, query) {
  return request({
    url: '/keyauth/v1/tags/' + id,
    method: 'get',
    params: query
  })
}

export function createTag(data) {
  return request({
    url: '/keyauth/v1/tags/',
    method: 'post',
    data
  })
}

export function deleteTag(id, query) {
  return request({
    url: '/keyauth/v1/tags/' + id,
    method: 'delete',
    params: query
  })
}
