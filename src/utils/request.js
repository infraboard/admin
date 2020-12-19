import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getAccessToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.accessToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-OAUTH-TOKEN'] = getAccessToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      // 判断是否需要刷新token, 并重新请求
      if (res.code === 50014) {
        return store.dispatch('user/refreshToken').then(() => {
          response.config.headers['X-OAUTH-TOKEN'] = getAccessToken()
          return axios.request(response.config).then((retryResp) => {
            return retryResp.data
          })
        })
      }

      // token不合法, 或者刷新token失效 需要重新登录
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50015) {
        // to re-login
        let message = ''
        switch (res.code) {
          case 50015:
            message = '当前会话已经过期, 您可以取消停留在此页面或再次登录'
            break
          case 50012:
            message = '你已通过其他端登录, 如非本人操作, 请尽快重置密码'
            break
        }

        return MessageBox.confirm(message, '确认退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await store.dispatch('user/resetToken')
          location.reload()
        })
      }

      // 对于特定的请求专门放行, 让页面逻辑处理
      if (res.code === 50018) {
        return Promise.reject(res)
      }

      Message({
        message: res.reason + ' : ' + res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    var message = error
    if (error.response) {
      const res = error.response.data
      message = res.reason + ': ' + res.message
    }

    // 对于特定的请求专门放行, 让页面逻辑处理
    if (error.response) {
      if (!error.response.config.headers.Skip404) {
        Message({
          message: message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      Message({
        message: error,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
