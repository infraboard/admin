import request from '@/utils/request'

export function queryEvent(query) {
  return request({
    url: '/eventbox/api/v1/events',
    method: 'get',
    params: query
  })
}
