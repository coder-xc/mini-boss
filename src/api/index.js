import Vue from 'vue'
import ajax from './ajax'
import jsonp from 'jsonp'
let v = new Vue()

/**
 * 登录接口
 */
export const login = ({ username, password }) => ajax({
  url: '/auth/login',
  method: 'POST',
  data: {
    username,
    password
  }
})

/**
 * 根据token获取用户信息
 */
export const getUserInfo = () => ajax({
  url: '/auth/user',
  headers: {
    checkToken: true
  }
})

/**
 * 获取所有后台系统的用户
 */
export const getAdminUser = () => ajax({
  url: '/auth/users',
  headers: {
    checkToken: true
  }
})

/**
 * 添加用户
 */
export const addUser = ({ username, password }) => ajax({
  url: '/auth/register',
  method: 'POST',
  data: {
    username,
    password
  },
})

/**
 * 修改用户
 */
export const updateUser = ({ username, password, _id }) => ajax({
  url: `/auth/users/${_id}`,
  method: 'PUT',
  data: {
    username,
    password
  },
  headers: {
    checkToken: true
  }
})

/**
 * 删除用户
 */
export const delUser = ({ _id }) => ajax({
  url: `/auth/users/${_id}`,
  method: 'DELETE',
  headers: {
    checkToken: true
  }
})

// 发送 jsonp 请求得到天气信息
export const reqWeather = (city) => {
  return new Promise((resolve) => {
    // 执行器函数：内部去执行异步任务，
    // 成功了调用 resolve(), 失败了不调用 reject()，直接提示错误
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

    jsonp(url, {}, (err, data) => {
      if (!err && data.error === 0) { // 成功的
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else { // 失败
        v.$message.error('获取天气信息失败')
      }
    })
  })
}

/**
 * 获取轮播图
 */
export const reqBanner = () => ajax({
  url: '/banners',
  headers: {
    checkToken: true
  }
})

/**
 * 上传图片
 */
export const uploadImg = (file) => {
  let param = new FormData()  // 创建form对象
  param.append('file', file)  // 通过append向form对象添加数据
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      checkToken: true
    }
  }
  return ajax.post('/upload', param, config)
}


/**
 * 添加或修改轮播图
 */
export const addUpdateBanner = ({ title, url, index, _id }) => ajax({
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
export const delBanner = (_id) => ajax({
  url: `/banners/${_id}`,
  method: 'DELETE',
  headers: {
    checkToken: true
  }
})

/**
 * 获取分类列表
 */
export const reqCategories = () => ajax({
  url: '/categories',
  headers: {
    checkToken: true
  }
})

/**
 * 添加或修改分类
 */
export const reqAddUpdateCategory = ({ parent = '', categoryName: name, url = '', attributes, _id }) => ajax({
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
export const deleteCategory = (_id) => ajax({
  url: `/categories/${_id}`,
  method: 'DELETE',
  headers: {
    checkToken: true
  }
})

/**
 * 获取活动列表
 */
export const reqActiveList = () => ajax({
  url: '/action'
})

/**
 * 添加/修改活动
 */
export const addUpdateActive = ({ title, icon, _id }) => ajax({
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
export const delActive = ({ _id }) => ajax({
  url: `/action/${_id}`,
  method: 'DELETE'
})

/**
 * 获取商品
 */
export const reqGoods = () => ajax({
  url: '/commodities',
})


/**
 * 获取商品服务
 */
export const reqGoodsServices = () => ajax('/services')

/**
 * 添加/修改商品服务
 */
export const reqAddUpdateGoodsService = ({ name, message, icon, _id }) => ajax({
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
export const reqDelGoodsService = ({ _id }) => ajax({
  url: `/services/${_id}`,
  method: 'DELETE'
})