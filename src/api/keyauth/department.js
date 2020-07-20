import request from '@/utils/request'

export function queryDepartment(query) {
  return request({
    url: '/keyauth/v1/departments',
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

export function deleteDepartment(id, query) {
  return request({
    url: '/keyauth/v1/departments/' + id,
    method: 'delete',
    params: query
  })
}
