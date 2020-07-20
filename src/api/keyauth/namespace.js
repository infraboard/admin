import request from '@/utils/request'

export function queryNamespaces(query) {
  return request({
    url: '/keyauth/v1/namespaces',
    method: 'get',
    params: query
  })
}

export function createNamespace(data) {
  return request({
    url: '/keyauth/v1/namespaces/',
    method: 'post',
    data
  })
}

export function deleteNamespace(id, query) {
  return request({
    url: '/keyauth/v1/namespaces/' + id,
    method: 'delete',
    params: query
  })
}
