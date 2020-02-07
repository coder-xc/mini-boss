import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../vuex/store'

import Home from '../views/home/Home.vue'
import Banner from '../views/banner/BannerList.vue'
import Login from '../views/login/Login.vue'
import Category from '../views/category/CategoryList.vue'
import UserList from '../views/user/UserList.vue'
import Acitve from '../views/activity/ActivityList.vue'
Vue.use(VueRouter)

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
        component: Category
      },
      {
        path: '/userlist',
        component: UserList
      },
      {
        path: '/active',
        component: Acitve
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
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
