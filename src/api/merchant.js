import request from '@/utils/request'


/**
 * 获取店铺列表
 */
export const reqMerchants = (query) => request(`/selles?query=${JSON.stringify(query)}`);

/**
 * 添加/修改店铺
 */
export const reqAddUpdateMerchant = ({ name, logo, commodities, salesVolume, commoditiesCount, appraise, collectCount, _id }) => request({
  url: `/selles${_id ? `/${_id}` : ""}`,
  method: `${_id ? "PUT" : "POST"}`,
  data: {
    name,
    logo,
    commodities,
    salesVolume,
    commoditiesCount,
    appraise,
    collectCount
  }
})

/**
 * 删除店铺
 */
export const reqDelMerchant = ({ _id }) => request({
  url: `/selles/${_id}`,
  method: 'DELETE'
})
