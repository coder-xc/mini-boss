import request from '@/utils/request'

/**
 * 获取分类列表
 */
export const reqCategories = () => request({
  url: '/categories',
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