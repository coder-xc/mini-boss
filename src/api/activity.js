import request from '@/utils/request'

/**
 * 获取活动列表
 */
export const reqActiveList = () => request({
  url: '/action'
})

/**
 * 添加/修改活动
 */
export const addUpdateActive = ({ title, icon, _id }) => request({
  url: `/action${_id ? `/${_id}` : ''}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    title,
    icon
  }
})

/**
 * 删除活动
 */
export const delActive = ({ _id }) => request({
  url: `/action/${_id}`,
  method: 'DELETE'
})