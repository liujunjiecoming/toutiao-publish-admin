import request from '@/utils/request'

export const getArticle = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 新建文章
export const addArticle = (data, draft) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否存为草稿
    },
    data
  })
}

// 获取文章
export const queryArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 编辑文章
export const editArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}
