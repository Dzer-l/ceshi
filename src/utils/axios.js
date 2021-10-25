import Axios from 'axios'
import { Message } from 'element-ui'
import { showLoading, hideLoading } from './loading'
import cfg from './config'
import store from '@/store'
import router from '@/router'

Axios.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `bearer ${store.getters.token}`
    }
    return config
  }
)

Axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH // 设置默认请求头

export function axios(url, data = {}, config = {}) {
  if ((url.indexOf('order-document-preview-img') === -1 && url.indexOf('order-proposer-material-preview-img') === -1) && url.indexOf('order-proposer-material-preview-word-img') === -1 && url.indexOf('org/evid-file-check') === -1 && url.indexOf('order-material-preview-img') === -1) { showLoading() }
  const axiosCfg = Object.assign(JSON.parse(JSON.stringify(cfg.httpCfg)), config)
  data = cfg.fileAPIList.indexOf(url) === -1 && axiosCfg.method !== 'get' && url.indexOf('org/upload-order-pay-qr-code/') ? JSON.stringify(data) : data
  axiosCfg.method === 'get' ? axiosCfg.params = data : axiosCfg.data = data
  if(url.indexOf('preview-seal-file')!==-1){
    axiosCfg.responseType='arraybuffer'
  }
  axiosCfg.validateStatus = function(status) {
    return status >= 200 && status < 500 // 默认的
  }

  return new Promise((resolve, reject) => {
    Axios({ url, ...axiosCfg }).then(async(res) => {
      if ((url.indexOf('order-document-preview-img') === -1 && url.indexOf('order-proposer-material-preview-img') === -1) && url.indexOf('order-proposer-material-preview-word-img') === -1 && url.indexOf('org/evid-file-check') === -1 && url.indexOf('order-material-preview-img') === -1) { hideLoading() }

      if (res.status === 401 || res.status === 402) {
        Err(res.status)
      } else {
        resolve(res.data)
      }
    }).catch(err => {
      hideLoading()
      Err(err + '')
      reject('')
    })
  })
}

function Err(err) {
  if (err === 401) {
    Message.error('登录失效!')
    store.dispatch('user/logout')
    router.push({ name: 'login' })
    return
  }
  if (err === 402) {
    Message.error('该账号在其他地方登录')
    store.dispatch('user/logout')
    router.push({ name: 'login' })
    return
  }
  Message.error('服务器开小差了，请稍后再试')
}
