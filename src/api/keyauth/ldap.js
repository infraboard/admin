import request from '@/utils/request'

export function queryDomainLDAP(query) {
  return request({
    url: '/keyauth/v1/settings/ldap',
    method: 'get',
    headers: { 'Skip404': true },
    params: query
  })
}

export function saveDomainLDAP(data, params) {
  return request({
    url: '/keyauth/v1/settings/ldap/',
    method: 'post',
    params: params,
    data
  })
}

export function checkDomainLDAP() {
  return request({
    url: '/keyauth/v1/settings/ldap/conn_check',
    method: 'post'
  })
}
