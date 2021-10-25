import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { showLoading, hideLoading } from './loading'
// import { getToken,getRefreshToken } from '@/utils/auth'
import router from '@/views/systemManage'
import cfg from '@/utils/config'
// import { changeToken } from '@/utils/format'

// create an axios instance
const service = axios.create({
  baseURL: cfg.http,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
// let token = getToken();
// let refreshToken = getRefreshToken();

service.interceptors.request.use(
  config => {
    if (config.url.indexOf('watch-img') === -1) {
      showLoading()
    }
    // do something before request is sent
    if (store.getters.token) {
      config.headers.Authorization = 'bearer ' + store.getters.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    hideLoading()
    // if(token){
    //     sessionStorage.setItem('click_time', new Date());
    //     // let clickTime =  new Date(sessionStorage.getItem("click_time"));
    //     // let resetTime =  new Date(sessionStorage.getItem("reset_time"));
    //     // let currentTime = new Date();
    //     // if(currentTime-resetTime>20*1000 && currentTime-clickTime<20*1000){
    //     //     let param = {
    //     //         refresh_token: refreshToken
    //     //     }
    //     //     changeToken(param).then( res =>{
    //     //         console.log(res)
    //     //     })
    //     // }
    // }
    const res = response.data
    return res
    // }
  },
  error => {
    hideLoading()
    console.log('err' + error) // for debug
    error = error + ''
    if (error.indexOf('status code 401') !== -1) {
      Message.error('登录失效!')
      store.dispatch('user/logout')
      router.push({ name: 'login' })
    }

    if (error.indexOf('status code 402') !== -1) {
      Message.error('该账号在其他地方登录')
      store.dispatch('user/logout')
      router.push({ name: 'login' })
    }
    // Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
