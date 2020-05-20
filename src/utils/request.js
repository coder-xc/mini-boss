/**
 * 封装axios的模块
 */
import Vue from 'vue'
import axios from 'axios';
import router from '@/router'
import store from '@/vuex/store'
import { serverURL } from '@/utils/serverConfig'
import { Message } from 'element-ui'

const instance = axios.create({
  baseURL: serverURL
})

// 存放axios的cancel对象，用于取消请求
Vue.prototype._axiosPromiseArr = []

/**
 * 添加请求拦截器, 处理请求参数问题以及token问题
 */
instance.interceptors.request.use((config) => {
  // 处理请求参数
  // debugger
  if (config.data && (config.data instanceof FormData) === false) {
    config.data = JSON.parse(JSON.stringify(config.data))
    for (let item in config.data) {
      if (config.data[item] === "") {
        delete config.data[item]
      }
    }
  }

  /**
   * new一个Cancel对象，并push到Vue.prototype._axiosPromiseArr中
   */
  config.cancelToken = new axios.CancelToken(cancel => {
    Vue.prototype._axiosPromiseArr.push(cancel)
  })

  // 处理token
  const token = store.state.adminUser.token
  if (token) {
    config.headers['Authorization'] = token
  } else {
    if (config.headers.checkToken) {
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
  response => {
    // debugger
    return response.data
  },
  error => {
    // debugger
    // 1. 没有token直接发请求的错误
    if (!error.response) {
      // 取消请求特殊处理
      if (error.message.code === 600) {
        Message.warning(error.message.msg)
        return;
      }
      // 提示错误, 并且跳转到登录页
      Message.error('没有授权, 请重新登录', error.message)
      store.dispatch('logout')
      router.replace('/login')
    } else {
      // 2. 发了请求, 但账号密码错误
      if (error.response.status === 400) return Promise.reject(error) // 返回一个reject状态的promise
      if (error.response.status === 401) {
        // 3. 发了请求, 但token失效了
        store.dispatch('logout')
        Message.error('授权失败，请重新登录，错误码：' + error.response.status)
        router.replace('/login')
      } else if (error.response.status === 404) {
        // 4. 发了请求, 资源不存在404
        Message.error('您请求的资源不存在，错误码：' + error.response.status)
      } else if (error.response.status === 500) {
        Message.error('服务器内部错误，错误码：' + error.response.status)
      } else {
        Message.error('请求错误，请检查网络后重试，错误码：' + error.response.status)
      }
    }
    return new Promise(() => { }) // 返回一个pedding状态的promise
  }
)

export default instance;