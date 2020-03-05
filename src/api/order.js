import request from '@/utils/request'

/**
 * 获取订单列表
 */
export const reqOrders = () => request({
  url: "/orders"
})

/**
 * 添加订单
 */
export const reqAddOrder = ({commoditis, user}) => request({
  url: "/orders",
  method: 'POST',
  data: {
    commoditis,
    user
  }
})