/**
 操作loacl数据的工具函数模块
 */
import store from 'store'


const USER_KEY = 'user_key'

export default {


    // 保存user
    saveUser(user) { 
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },


     // 需要返回一个 user 对象，如果没有，返回空对象
    getUser() { 
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    // 删除保存的user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
     },
}