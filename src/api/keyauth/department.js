import request from '@/utils/request'

export function queryDepartment(query) {
  return request({
    url: '/keyauth/v1/departments',
    method: 'get',
    params: query
  })
}

export function describeDepartment(id, query) {
  return request({
    url: '/keyauth/v1/departments/' + id,
    method: 'get',
    params: query
  })
}

export function querySubDepartment(id, query) {
  return request({
    url: '/keyauth/v1/departments/' + id + '/subs',
    method: 'get',
    params: query
  })
}

export function createDepartment(data) {
  return request({
    url: '/keyauth/v1/departments/',
    method: 'post',
    data
  })
}

export function updateDepartment(id, data) {
  return request({
    url: '/keyauth/v1/departments/' + id,
    method: 'patch',
    data
  })
}

export function deleteDepartment(id, query) {
  return request({
    url: '/keyauth/v1/departments/' + id,
    method: 'delete',
    params: query
  })
}

export function joinDepartment(data) {
  return request({
    url: '/keyauth/v1/join_apply/',
    method: 'post',
    data
  })
}

export function describeJoinApply(id, query) {
  return request({
    url: '/keyauth/v1/join_apply/' + id,
    method: 'get',
    params: query
  })
}

export function queryJoinApply(query) {
  return request({
    url: '/keyauth/v1/join_apply/',
    method: 'get',
    params: query
  })
}

export function dealJoinApply(id, data) {
  return request({
    url: '/keyauth/v1/join_apply/' + id,
    method: 'patch',
    data
  })
}
