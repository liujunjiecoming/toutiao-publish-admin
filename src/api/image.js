/**
 * 上传图片请求模块
 */
import request from '@/utils/request'

export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 后端接口content-type 为 multipart/form-data时
    // axios不需手动设置，只要给data一个 FormData 对象即可
    data
  })
}

/**
 * 获取用户图片素材
 */
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    // 后端接口content-type 为 multipart/form-data时
    // axios不需手动设置，只要给data一个 FormData 对象即可
    params
  })
}
