/**
 * 封装axios的模块
 */
import Vue from 'vue'
import axios from 'axios';
import qs from 'qs';
let v = new Vue()

const baseURL = ''

const instance = axios.create({
  timeout: 10000, // 设置请求超时时间
  baseURL: baseURL + '/api'
})

/**
 * 添加请求拦截器, 处理post请求参数(从对象转换为urlencoding)
 */
instance.interceptors.request.use((config) => {
  if (config.method.toUpperCase() === 'POST' && (config.data instanceof FormData) === false && config.data instanceof Object) {
    config.data = qs.stringify(config.data)
  }
  return config
})

/**
 * 添加响应拦截器
 *  成功回调: 成功的结果不再是response, 而是response.data
 *  失败回调: 统一处理请求异常
 */
instance.interceptors.response.use(
  response => response.data,
  error => {
    v.$message.error(error.message);
    return new Promise(() => {}) // 返回一个pedding状态的promise
  }
)

export default instance