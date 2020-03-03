import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/vuex/store'

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

const router = new VueRouter({
  mode: 'history',
  routes,
  // base: '/shopadmin/', // 生产环境打包设置
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
