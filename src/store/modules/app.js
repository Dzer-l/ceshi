import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  imgList: [],
  initialIndex: 0,
  orderId: null,
  mask: null
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  CHANGE_IMAGE: (state, list) => {
    if (list) {
      state.imgList = list
    } else {
      state.imgList = []
    }
  },
  CHANGE_INITIALINDEX(state, initialIndex) {
    if (initialIndex) {
      state.initialIndex = initialIndex
    } else {
      state.initialIndex = 0
    }
  },
  CHANGE_ORDERID: (state, list) => {
    if (list) {
      state.orderId = list
    } else {
      state.orderId = null
    }
  },
  MASK_CHANGE: (state, list) => {
    if (list) {
      state.mask = list
    } else {
      state.mask = null
    }
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  changeImage({ commit }, list) {
    commit('CHANGE_IMAGE', list)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
