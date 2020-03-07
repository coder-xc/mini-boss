import request from '@/utils/request'

/**
 * 获取订单列表
 */
export const reqOrders = (query) => request({
  url: `/orders?query=${JSON.stringify(query)}`
})

/**
 * 添加/修改订单
 */
export const reqAddUpdateOrder = ({ commoditis, user, _id }) => request({
  url: `/orders${_id ? `/${_id}` : ""}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    commoditis,
    user
  }
})

/**
 * 删除订单
 */
export const reqDelOrder = ({ _id }) => request({
  url: `/orders/${_id}`,
  method: 'DELETE'
})