import { PERMISSION_MAPPING_VIEW } from '../mutation-types'
import { getUserInfo } from 'api/user'

const state = {
  cache: false,
  cacheData: {},
  mandatoryRefresh: false,
  menuList: [],
  activity: {},
  banner: {},
  category: {},
  comment: {},
  goods: {},
  order: {},
  merchant: {},
  services: {},
  role: {},
}

//权限 -> 对应视图是否渲染
/**
 * 
 * data 
 * menuList : []
 * banner : {}
 * category : {}
 * goods : {}
 * service : {}
 * order : {}
 * merchant : {}
 * comment : {}
 * auth : {}
 * activity : {}
 * role : null
 */
const permissionMappingView = (data) => {
  let mapObj = {
    actions: 'activity',
    banners: 'banner',
    categories: 'category',
    comments: 'comment',
    commodities: 'goods',
    orders: 'order',
    selles: 'merchant',
    services: 'services',
    roles: 'role'
  }

  //合并 去重
  data.roles.forEach(role => {
    role.permission.forEach(permission => {
      var has = data.permission.some(item => {
        return item._id == permission._id
      })
      if (!has)
        data.permission.push()
    })
  })


  data.permission.forEach(item => {
    switch (item.method) {
      case 'get': state[mapObj[item.path]].find = true
        break
      case 'post': state[mapObj[item.path]].create = true
        break
      case 'put': state[mapObj[item.path]].update = true
        break
      case 'delete': state[mapObj[item.path]].delete = true
        break
    }
  })

  let menuListMapObj = {
    activity: {
      title: '活动管理',
      key: '/active',
      icon: 'el-icon- iconfont icon-huodong',
      children: [ // 子菜单列表
        {
          title: '活动管理',
          key: '/active/activelist',
          icon: ''
        },
      ]
    },
    banner: {
      title: '轮播图',
      key: '/banner',
      icon: 'el-icon-picture',
      children: [ // 子菜单列表
        {
          title: '首页轮播图',
          key: '/banner/bannerlist',
          icon: 'el-icon-picture'
        },
      ]
    },
    category: {
      title: '分类管理',
      key: '/category',
      icon: 'el-icon- iconfont icon-leimupinleifenleileibie',
      children: [ // 子菜单列表
        {
          title: '分类列表',
          key: '/category/categorylist',
          icon: ''
        },
      ]
    },
    comment: {
      title: '评论管理',
      key: '/comment',
      icon: 'el-icon- iconfont icon-ziyuan',
      children: [ // 子菜单列表
        {
          title: '评论列表',
          key: '/comment/commentlist',
          icon: ''
        },
      ]
    },
    goodsAndServices: {
      title: '商品管理',
      key: '/goods',
      icon: 'el-icon-goods',
      children: [ // 子菜单列表
      ]
    },
    goods: {
      title: '商品列表',
      key: '/goods/goodslist',
      icon: ''
    },
    order: {
      title: '订单管理',
      key: '/order',
      icon: 'el-icon- iconfont icon-dingdanguanli',
      children: [ // 子菜单列表
        {
          title: '订单列表',
          key: '/order/orderlist',
          icon: ''
        },
      ]
    },
    merchant: {
      title: '商家管理',
      key: '/merchant',
      icon: 'el-icon- iconfont icon-shangjia',
      children: [ // 子菜单列表
        {
          title: '店铺列表',
          key: '/merchant/merchantlist',
          icon: ''
        },
      ]
    },
    services: {
      title: '商品服务',
      key: '/goods/goodsservice',
      icon: ''
    },
    // role: {}
  }

  let flag = true
  if (state.menuList.length !== 0) {
    return;
  }
  for (const key in menuListMapObj) {
    // console.log(state[key].find)
    const standard = key == 'goods' || key == 'services' || key == 'goodsAndServices'
    // debugger
    if (standard && flag) {

      if (state.goods.find || state.services.find) {
        if (state.goods.find) {
          menuListMapObj.goodsAndServices.children.push(menuListMapObj.goods)
        }
        if (state.services.find) {
          menuListMapObj.goodsAndServices.children.push(menuListMapObj.services)
        }
        state.menuList.push(menuListMapObj.goodsAndServices)
        flag = false
      } else {
        state.menuList.push(menuListMapObj.goodsAndServices)
        flag = false
      }
    } else if (!standard && state[key].hasOwnProperty('find') && state[key]['find']) {
      //模块 中 只有一项 而且不是 其他模块子项
      state.menuList.push(menuListMapObj[key])
    }
  }
  // console.log(state.menuList, state)
}

const mutations = {
  [PERMISSION_MAPPING_VIEW](state, data) {
    // console.log(func)
    permissionMappingView(data)
  }
}

const actions = {
  async getThisUserAuth({ commit }) {
    //缓存中没有数据 并且 不是强制刷新 重新请求数据
    if (!state.cache || state.mandatoryRefresh) {
      const result = await getUserInfo()
      state.cache = true
      state.cacheData = result
      commit(PERMISSION_MAPPING_VIEW, result, permissionMappingView)
    } else {
      //以前拿到过接口的数据 防止多次请求 增加接口压力
      commit(PERMISSION_MAPPING_VIEW, state.cacheData, permissionMappingView)
    }
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
};