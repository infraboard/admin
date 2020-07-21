import request from '@/utils/request'

export function getProfile() {
  return request({
    url: '/keyauth/v1/profile/',
    method: 'get'
  })
}

export function updateProfile(data) {
  return request({
    url: '/keyauth/v1/profile/',
    method: 'put',
    data
  })
}

export function getMyDomain() {
  return request({
    url: '/keyauth/v1/profile/domain',
    method: 'get'
  })
}

export function updateMyDomain(data) {
  return request({
    url: '/keyauth/v1/profile/domain',
    method: 'put',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/keyauth/v1/password',
    method: 'put',
    data
  })
}
