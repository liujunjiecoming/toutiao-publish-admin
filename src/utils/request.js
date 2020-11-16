/**
 * 基于asiox的封装
 */
import axios from 'axios'

// 创建一个axios示例
// 我们通过这个实例取发请求，
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

export default request
