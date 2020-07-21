import request from '@/utils/request'

const defaultSettings = require('@/settings.js')

export function login(data) {
  return request({
    url: '/keyauth/v1/oauth2/tokens/',
    method: 'post',
    auth: {
      username: defaultSettings.client_id,
      password: defaultSettings.client_secret
    },
    data
  })
}

export function refreshAccessToken(data) {
  return request({
    url: '/keyauth/v1/oauth2/tokens/',
    method: 'post',
    auth: {
      username: defaultSettings.client_id,
      password: defaultSettings.client_secret
    },
    data
  })
}

export function logout() {
  return request({
    url: '/keyauth/v1/oauth2/tokens/',
    method: 'delete',
    auth: {
      username: defaultSettings.client_id,
      password: defaultSettings.client_secret
    }
  })
}
