import request from '@/utils/request'

export function createSubAccount(data) {
  return request({
    url: '/keyauth/v1/sub_users/',
    method: 'post',
    data
  })
}

export function querySubAccount(query) {
  return request({
    url: '/keyauth/v1/sub_users/',
    method: 'get',
    params: query
  })
}

export function updateSubAccount(id, data) {
  return request({
    url: '/keyauth/v1/sub_users/' + id,
    method: 'patch',
    data: data
  })
}

export function deleteSubAccount(id, query) {
  return request({
    url: '/keyauth/v1/sub_users/' + id,
    method: 'delete',
    params: query
  })
}
