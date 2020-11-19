import request from '@/utils/request'

export function updateSecuritySetting(data) {
  return request({
    url: '/keyauth/v1/settings/domain/security',
    method: 'patch',
    data
  })
}
