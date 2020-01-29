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
    headers: {'Content-Type': 'multipart/form-data'}
  }
  return ajax.post('/upload', param, config)
}

// 添加轮播图
export const addBanner = ({title, url, index}) => ajax({
  url: '/banners',
  method: 'POST',
  data: {
    title,
    url,
    index
  }
})