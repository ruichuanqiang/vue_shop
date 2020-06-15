// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import ElementUI, {
  Message,
  MessageBox
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 配置axios请求
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置axios 请求拦截功能
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
