import { asyncRoutes, constantRoutes } from '@/router'
import { getUserMenu } from '@/api/userInfo'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log(state.routes)
  }
}

/**
 * 后台传入权限转换
 * @param arr1为后台获取到的原始数据
 * @param arr2为存储转换后的数据
 */
function getAuthority(arr1, arr2) {
  arr1.forEach(item => {
    arr2.push(item.menuName)
    if (item.childMenus.length > 0) {
      getAuthority(item.childMenus, arr2)
    }
  })
}
/**
 * 对routes进行权限操作
 * @param arr1为原始route数组
 * @param arr2为传入的权限数组
 */
function routeTrans(arr1, arr2) {
  arr1.forEach(item => {
    if (arr2.indexOf(item.name) >= 0) {
      item.hidden = false
    }
    if (item.children) {
      routeTrans(item.children, arr2)
    }
  })
}
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const routers = asyncRoutes
      console.log(asyncRoutes)
      getUserMenu().then(res => {
        if (res.success) {
          const temp = res.data; const authorityArr = []
          if (Array.isArray(temp)) {
            getAuthority(temp, authorityArr)
          }
          routeTrans(routers, authorityArr)
        }
      })
      let accessedRoutes = []
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
