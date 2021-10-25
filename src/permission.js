import router from './router'
import { constantRoutes } from './router'
import store from './store'
import { axios } from './utils/axios'
import * as fun from './utils/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  if (JSON.parse(sessionStorage.getItem('savePath')) && window.location.href.indexOf(to.redirectedFrom) !== -1) {
    const data = JSON.parse(sessionStorage.getItem('savePath'))
    const path = fun.getMenuTree(data, [])
    sessionStorage.removeItem('savePath')
    router.options.routes = constantRoutes.concat(path)
    router.addRoutes(path)
    router.replace(to.redirectedFrom)
    setTimeout(sessionStorage.setItem('savePath', JSON.stringify(data)), 1000)
  }

  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (router.options.routes.length <= 6) {
        axios('org/menu-tree?type=' + 0).then(res => {
          sessionStorage.setItem('savePath', JSON.stringify(res.data))
          const path = fun.getMenuTree(res.data, [])
          router.options.routes = constantRoutes.concat(path)
          router.addRoutes(path)
          next()
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
