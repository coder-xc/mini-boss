import request from '@/utils/request'
import jsonp from 'jsonp'
import { Message } from 'element-ui'

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
        Message.error('获取天气信息失败')
      }
    })
  })
}

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
  return request.post('/upload', param, config)
}