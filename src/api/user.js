/**
 * 用户相关请求模块
 */
import request from '@/utils/request'

export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 通过 headers 选项设置请求头
    // headers: {
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 获取用户信息
export const getUserMsg = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 通过 headers 选项设置请求头
    // headers: {
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}
