import Vue from 'vue'
import '@babel/polyfill'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import { axios } from './utils/axios'
import cfg from './utils/config'
import * as fun from './utils/index'
import qs from 'qs'
import 'default-passive-events'
import * as WPS from "./utils/web-office-sdk-v1.1.12.es";

import '@/icons' // icon
import '@/permission' // permission control

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$cfg = cfg
Vue.prototype.$fun = fun
Vue.prototype.$qs = qs
Vue.prototype.wps = WPS;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
