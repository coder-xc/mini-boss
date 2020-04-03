import request from '@/utils/request'
import jsonp from 'jsonp'
import { Message } from 'element-ui'

// 发送 jsonp 请求得到天气信息
export const reqWeather = () => {
  return new Promise((resolve) => {
    // 执行器函数：内部去执行异步任务，
    // 成功了调用 resolve(), 失败了不调用 reject()，直接提示错误
    const url = `https://tianqiapi.com/api?version=v6&appid=81661511&appsecret=0oTDWd9T&vue=1`
    jsonp(url, {}, (err, data) => {
      if (!err) {
        const { wea_img, wea } = data;
        resolve({ wea_img, wea });
      } else {
        Message.error('获取天气信息失败');
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