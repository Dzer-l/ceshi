import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    // refresh_token: getRefreshToken(),
    // reset_time: getResetTime(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_REFRESH_TOKEN: (state, token) => {
  //     state.refresh_token = token
  // },
  // SET_RESET_TIME: (state, time) => {
  //     state.reset_time = time
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response
        if (response.access_token) {
          commit('SET_TOKEN', data.access_token)
          // commit('SET_REFRESH_TOKEN', data.refresh_token)
          // commit('SET_RESET_TIME', new Date())
          setToken(data)
          resolve()
        } else {
          Message.error(response.msg)
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getRouter({ commit, state }) {
    return new Promise((resolve, reject) => {
      var data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
      resolve(data)
      // getRouter().then(response => {
      //     const { data } = response.data
    })
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
    location.reload()
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
