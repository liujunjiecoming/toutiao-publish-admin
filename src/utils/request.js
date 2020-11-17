/**
 * 基于asiox的封装
 */
import axios from 'axios'

// 创建一个axios示例
// 我们通过这个实例取发请求，
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

request.interceptors.request.use(
  // 所有请求会经过这里
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))

    // 如果有登录用户信息，则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
  },
  // 请求失败，会经过这里
  function (error) {
    return Promise.reject(error)
  }
)

export default request
