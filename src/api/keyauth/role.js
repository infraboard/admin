import request from '@/utils/request'

export function queryRole(query) {
  return request({
    url: '/keyauth/v1/roles',
    method: 'get',
    params: query
  })
}

export function descRole(id, query) {
  return request({
    url: '/keyauth/v1/roles/' + id,
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/keyauth/v1/roles/',
    method: 'post',
    data
  })
}

export function deleteRole(id, query) {
  return request({
    url: '/keyauth/v1/roles/' + id,
    method: 'delete',
    params: query
  })
}

export function listResource(query) {
  return request({
    url: '/keyauth/v1/resources/',
    method: 'get',
    params: query
  })
}

export function listRolePermission(id) {
  return request({
    url: '/keyauth/v1/roles/' + id + '/permissions/',
    method: 'get'
  })
}

export function addPermissionToRole(id, data) {
  return request({
    url: '/keyauth/v1/roles/' + id + '/permissions/',
    method: 'post',
    data
  })
}

export function removePermissionFromRole(id, data) {
  return request({
    url: '/keyauth/v1/roles/' + id + '/permissions/',
    method: 'delete',
    data
  })
}

export function updatePermission(id, data) {
  return request({
    url: '/keyauth/v1/permissions/' + id,
    method: 'put',
    data
  })
}
