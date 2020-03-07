import request from '@/utils/request'

/**
 * 获取分类列表
 */
export const reqCategories = (query) => request({
  url: `/categories?query=${JSON.stringify(query)}`,
  headers: {
    checkToken: true
  }
})

/**
 * 添加或修改分类
 */
export const reqAddUpdateCategory = ({ parent = '', categoryName: name, url = '', attributes, _id }) => request({
  url: `/categories${_id ? `/${_id}` : ''}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    parent,
    name,
    url,
    attributes
  },
  headers: {
    checkToken: true
  }
})

/**
 * 删除分类
 */
export const deleteCategory = (_id) => request({
  url: `/categories/${_id}`,
  method: 'DELETE',
  headers: {
    checkToken: true
  }
})