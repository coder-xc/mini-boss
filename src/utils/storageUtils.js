/**
 操作loacl数据的工具函数模块
 */
import store from 'store'


const TOKEN = 'token'

export default {
    // 保存token
    saveToken(token) { 
        store.set(TOKEN, token)
    },


     // 需要返回一个 token，如果没有，返回空字符串
    getToken() { 
        return store.get(TOKEN) || ""
    },

    // 删除保存的user
    removeToken() {
        // localStorage.removeItem(USER_KEY)
        store.remove(TOKEN)
     },
}