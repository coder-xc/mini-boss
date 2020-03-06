import request from '@/utils/request'

/**
 * 获取评论
 */
export const reqComment = () => request({
  url: '/comments'
})

/**
 * 添加/修改评论
 */
export const reqAddUpdateComment = ({ order, message, images, _id }) => request({
  url: `/comments${_id ? `/${_id}` : ""}`,
  method: `${_id ? "PUT" : "POST"}`,
  data: {
    order,
    message,
    images
  }
})

/**
 * 删除评论
 */
export const reqDelComment = ({ _id }) => request({
  url: `/comments/${_id}`,
  method: 'DELETE'
})