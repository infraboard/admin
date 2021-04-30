import request from '@/utils/request'

export function queryLoginLog(query) {
  return request({
    url: '/keyauth/v1/sessions',
    method: 'get',
    params: query
  })
}

export function getSession(id, query) {
  return request({
    url: `/keyauth/v1/sessions/${id}`,
    method: 'get',
    params: query
  })
}
