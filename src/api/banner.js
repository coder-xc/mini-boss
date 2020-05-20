import request from '@/utils/request'

/**
 * 获取轮播图
 */
export const reqBanner = (query) => {
  // debugger
  return request({
    url: `/banners?query=${JSON.stringify(query)}`,
    headers: {
      checkToken: true
    }
  })
}

/**
 * 添加或修改轮播图
 */
export const addUpdateBanner = ({ title, url, index, _id }) => request({
  url: `/banners${_id ? `/${_id}` : ''}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    title,
    url,
    index
  },
  headers: {
    checkToken: true
  }
})

/**
 * 删除轮播图
 */
export const delBanner = (_id) => request({
  url: `/banners/${_id}`,
  method: 'DELETE',
  headers: {
    checkToken: true
  }
})