import request from '@/utils/request'


/**
 * 获取店铺列表
 */
export const reqMerchants = () => request("/selles");

/**
 * 添加店铺
 */
export const reqAddMerchant = ({name, logo, commodities, salesVolume, commoditiesCount, appraise, collectCount}) => request({
  url: '/selles',
  method: 'POST',
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
export const reqDelMerchant = ({_id}) => request({
  url: `/selles/${_id}`,
  method: 'DELETE'
})
