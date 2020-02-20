import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import './plugins/element.js'
import '../src/assets/css/global.css';
import '../src/assets/css/reset.css';
import '../src/assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
