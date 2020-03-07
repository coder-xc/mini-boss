import request from '@/utils/request'

/**
 * 获取商品
 */
export const reqGoods = (query) => request({
  url: `/commodities?query=${JSON.stringify(query)}`,
})

/**
 * 添加/修改商品
 */
export const reqAddUpdateGoods = (params) => {
  const { _id } = params;
  return request({
    url: `/commodities${_id ? `/${_id}` : ''}`,
    method: `${_id ? 'PUT' : 'POST'}`,
    data: params
  })
}

/**
 * 删除商品
 */
export const reqDelGoods = ({ _id }) => request({
  url: `/commodities/${_id}`,
  method: 'DELETE'
})

/**
 * 获取商品服务
 */
export const reqGoodsServices = (query) => request(`/services?query=${JSON.stringify(query)}`)

/**
 * 添加/修改商品服务
 */
export const reqAddUpdateGoodsService = ({ name, message, icon, _id }) => request({
  url: `/services${_id ? `/${_id}` : ''}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    name,
    message,
    icon
  },
  headers: {
    checkToken: true
  }
})

/**
 * 删除商品服务
 */
export const reqDelGoodsService = ({ _id }) => request({
  url: `/services/${_id}`,
  method: 'DELETE'
})