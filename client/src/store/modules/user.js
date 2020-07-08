import { login, getUserPerms } from '@/api/login.js'
import { setToken, removeToken } from '@/utils/auth.js'

const state = {
  username: '',
  avatar: '',
  isReq: false,
  dynamicMenu: [],
  tabMenu: [],
  btnMenu: []
}

const mutations = {
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ISREQ: (state, isReq) => {
    state.isReq = isReq
  },
  SET_DYNAMICMENU: (state, dynamicMenu) => {
    state.dynamicMenu = dynamicMenu
  },
  SET_TABMENU: (state, tabsMenu) => {
    state.tabMenu = tabsMenu
  },
  SET_BTNMENU: (state, buttonMenu) => {
    state.btnMenu = buttonMenu
  }
}

const actions = {
  login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (res.statusCode === 200) {
          setToken(res.data.accessToken, res.data.refreshToken)
          resolve()
        } else {
          reject(res.message)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  GetInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      const [dynamicMenu, tabsMenu, buttonMenu] = [[], [], []]
      commit('SET_ISREQ', true)
      getUserPerms().then(res => {
        if (res.statusCode === 200) {
          res.data.dynamicMenu.forEach(v => {
            if (v.type === 1) {
              dynamicMenu.push(v.code)
            } else if (v.type === 3) {
              buttonMenu.push(v.code)
            } else {
              tabsMenu.push(v.code)
            }
          })
          commit('SET_USERNAME', res.data.nickname)
          commit('SET_AVATAR', res.data.avatar)
          commit('SET_DYNAMICMENU', dynamicMenu)
          commit('SET_TABMENU', tabsMenu)
          commit('SET_BTNMENU', buttonMenu)

          resolve(dynamicMenu)
        } else {
          resolve(dynamicMenu)
        }
      })
    })
  },
  logout () {
    return new Promise((resolve, reject) => {
      removeToken()
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
