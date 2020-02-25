/**
 * 封装axios的模块
 */
import Vue from 'vue'
import axios from 'axios';
import router from '../router'
import store from '../vuex/store'
let v = new Vue()
// const baseURL = ''
const baseURL = 'http://dev.shubuzuo.top'
const instance = axios.create({
  // timeout: 30000, // 设置请求超时时间
  // baseURL: baseURL + '/api'
  baseURL: baseURL
})

/**
 * 添加请求拦截器, 处理请求参数问题以及token问题
 */
instance.interceptors.request.use((config) => {
  // 处理请求参数
  if (config.data && (config.data instanceof FormData) === false) {
    config.data = JSON.parse(JSON.stringify(config.data))
    for (let item in config.data) {
      if (config.data[item] === "") {
        delete config.data[item]
      }
    }
  }
  
  // 处理token
  const token = store.state.adminUser.token
  if(token) {
    config.headers['Authorization'] = token
  } else {
    if(config.headers.checkToken) {
      throw new Error('授权失败，请重新登录')
    }
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
    // 1. 没有token直接发请求的错误
    if(!error.response) {
      if(router.currentRoute.path !== '/login') {
        v.$message.error(error.message)
        router.replace('/login')
      }
    } else {
      // 2. 发了请求, 但token失效了
      if(error.response.status === 401) {
        store.dispatch('logout')
        if(router.currentRoute.path !== '/login') {
          v.$message.error('授权失败，请重新登录!')
          router.replace('/login')
        }
      } else if(error.response.status === 404) {
        v.$message.error('您请求的资源不存在!')
      } else if(error.response.status === 400) {
        v.$message.error('用户名或密码错误!')
      } else {
        v.$message.error('请求错误，请检查网络后重试!')
      }
    }
    return new Promise(() => { }) // 返回一个pedding状态的promise
  }
)

export default instance