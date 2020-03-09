import Vue from 'vue'
import App from './App.vue'
import MyBread from 'components/MyBread/MyBread.vue'
import router from './router'
import store from './vuex/store'
// 全局css
import './styles/index.scss'
// 基本样式
import './assets/css/reset.css';
// iconfont图标库
import './assets/fonts/iconfont.css'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本编辑器 css 样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

Vue.use(VueQuillEditor)
Vue.component(MyBread.name, MyBread)


new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')