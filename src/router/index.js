import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../vuex/store'

import Home from '../views/home/Home.vue'
import Banner from '../views/banner/BannerList.vue'
import Login from '../views/login/Login.vue'
import Category from '../views/category/Category.vue'
import CategoryList from '../views/category/CategoryList.vue'
import AddCategory from '../views/category/AddCategory.vue'
import UserList from '../views/user/UserList.vue'
import Acitve from '../views/activity/ActivityList.vue'
import Goods from '../views/goods/Goods.vue'
import GoodsList from '../views/goods/GoodsList.vue'
import Detail from '../views/goods/Detail.vue'

Vue.use(VueRouter)

// 修改路由push方法,阻止重复点击报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

// 修改路由replace方法,阻止重复点击报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/banner',
        component: Banner
      },
      {
        path: '/category',
        component: Category,
        redirect: '/categorylist',
        children: [
          {
            path: '/categorylist',
            component: CategoryList
          },
          {
            path: '/categorylist/addcategory',
            name: 'addCategory',
            component: AddCategory
          },
        ]
      },
      {
        path: '/userlist',
        component: UserList
      },
      {
        path: '/active',
        component: Acitve
      },
      {
        path: '/goods',
        component: Goods,
        redirect: '/goodslist',
        children: [
          {
            path: '/goodslist',
            component: GoodsList,
          },
          {
            path: '/goodslist/detail',
            name: 'detail',
            component: Detail
          },
        ]
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
  base: '/shopadmin/', // 生产环境打包设置
})
router.beforeEach((to, from, next) => {
  const token = store.state.adminUser.token;
  if (to.path === '/login') {
    if (token) {
      next('/home')
    } else {
      next()
    }
  }
  next()
})

export default router
