import request from '@/utils/request'

export function getSystemSetting() {
  return request({
    url: '/keyauth/v1/system_config',
    method: 'get'
  })
}

export function testEmailSetting(data) {
  return request({
    url: '/keyauth/v1/system_config/email/test',
    method: 'post',
    data
  })
}

export function setEmailSetting(data) {
  return request({
    url: '/keyauth/v1/system_config/email',
    method: 'post',
    data
  })
}

export function testSMSSetting(data) {
  return request({
    url: '/keyauth/v1/system_config/sms/test',
    method: 'post',
    data
  })
}

export function setSMSSetting(data) {
  return request({
    url: '/keyauth/v1/system_config/sms',
    method: 'post',
    data
  })
}

export function setVerifyCodeSetting(data) {
  return request({
    url: '/keyauth/v1/system_config/verify_code',
    method: 'post',
    data
  })
}

