import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from '../views/Welcome.vue'
import Home from '../views/home/Home.vue'
import Banner from '../views/banner/BannerList.vue'
import Login from '../views/login/Login.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/banner',
        component: Banner
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
