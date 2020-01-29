import ajax from './ajax'


// 获取轮播图
export const reqBanner = () => ajax({
  url: '/banners'
})

// 上传图片
export const uploadImg = (file) => {
  let param = new FormData()  // 创建form对象
  param.append('file', file)  // 通过append向form对象添加数据
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  return ajax.post('/upload', param, config)
}

// 添加或修改轮播图
export const addUpdateBanner = ({ title, url, index, _id }) => ajax({
  url: `/banners${_id ? `/${_id}` : ''}`,
  method: `${_id ? 'PUT' : 'POST'}`,
  data: {
    title,
    url,
    index
  }
})

// 删除轮播图
export const delBanner = (_id) => ajax({
  url: `/banners/${_id}`,
  method: 'DELETE'
})