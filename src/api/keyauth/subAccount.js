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

export function describeSubAccount(account, query) {
  return request({
    url: '/keyauth/v1/sub_users/' + account,
    method: 'get',
    params: query
  })
}

export function updateSubAccount(account, data) {
  return request({
    url: '/keyauth/v1/sub_users/' + account,
    method: 'patch',
    data: data
  })
}

export function deleteSubAccount(account, query) {
  return request({
    url: '/keyauth/v1/sub_users/' + account,
    method: 'delete',
    params: query
  })
}

export function resetSubAccountPassword(data) {
  return request({
    url: '/keyauth/v1/password/reset',
    method: 'put',
    data: data
  })
}

export function genRandomPassword(data) {
  return request({
    url: '/keyauth/v1/password/',
    method: 'post',
    data: data
  })
}
