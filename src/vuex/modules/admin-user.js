import {
  RECEIVE_ADMIN_USER,
  RECEIVE_TOKEN,
  LOGOUT,
  RECEIVE_USER_LIST,
} from '../mutation-types'

import {
  getAdminUser,
  getUserInfo,
} from 'api/user'

import storageUtils from '@/utils/storageUtils'

const state = {
  token: storageUtils.getToken(), // 登录token标识,
  adminUser: {},
  adminUserList: null,
  adminUserListTotal: 0,
  menus: [],
}
/**
 * 包含同步action和异步action
 */
const actions = {
  saveToken({ commit }, token) {
    storageUtils.saveToken(token)
    commit(RECEIVE_TOKEN, { token })
  },
  async saveUser({ commit }) {
    const user = await getUserInfo();
    const menus = [];
    user.permission.forEach(item => {
      switch (item.path) {
        case 'banners':
          if (!menus.find(item => item === '/banner')) {
            menus.push('/banner')
            menus.push('/banner/bannerlist')
          }
          break;
        case 'actions':
          if (!menus.find(item => item === '/active')) {
            menus.push('/active')
            menus.push('/active/activelist')
          }

          break;
        case 'categories':
          if (!menus.find(item => item === '/category')) {
            menus.push('/category')
            menus.push('/category/categorylist')
          }

          break;
        case 'comments':
          if (!menus.find(item => item === '/comment')) {
            menus.push('/comment')
            menus.push('/comment/commentlist')
          }
          break;
        case 'commodities':
          if (!menus.find(item => item === '/goods')) {
            menus.push('/goods')
            menus.push('/goods/goodslist')
          }
          break;
        case 'orders':
          if (!menus.find(item => item === '/order')) {
            menus.push('/order')
            menus.push('/order/orderlist')
          }
          break;
        case 'selles':
          if (!menus.find(item => item === '/merchant')) {
            menus.push('/merchant')
            menus.push('/merchant/merchantlist')
          }
          break;
        case 'services':
          if (!menus.find(item => item === '/goods/goodsservice')) {
            menus.push('/goods/goodsservice')
          }
          break;
        case 'roles':
          if (!menus.find(item => item === '/auth')) {
            menus.push('/auth')
            menus.push('/auth/rolelist')
          }
          break;
        default:
          break;
      }
    })
    commit(RECEIVE_ADMIN_USER, { user, menus })
  },
  logout({ commit }) {
    storageUtils.removeToken()
    commit(LOGOUT)
  },
  async getUserList({ commit }, query) {
    const result = await getAdminUser(query)
    commit(RECEIVE_USER_LIST, result)
  },
}

const mutations = {
  [RECEIVE_TOKEN](state, { token }) {
    state.token = token
  },
  [RECEIVE_ADMIN_USER](state, { user, menus }) {
    state.menus = menus
    state.adminUser = user
  },
  [LOGOUT](state) {
    state.token = ''
    state.adminUser = {}
  },
  [RECEIVE_USER_LIST](state, { data, total }) {
    state.adminUserList = data;
    state.adminUserListTotal = total;
  },
}



const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}