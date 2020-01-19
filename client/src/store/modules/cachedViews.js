const state = {
  cachedViews: []
}

const mutations = {
  ADD_CACHEDVIEW: (state, viewName) => {
    if (state.cachedViews.includes(viewName)) return
    state.cachedViews.push(viewName)
  },
  DEL_CACHEDVIEW: (state, viewName) => {
    const index = state.cachedViews.indexOf(viewName)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  CLEAR_CACHEVIEW: state => {
    state.cachedViews = []
  }
}

const actions = {
  AddCacheViews ({ commit }, routeName) {
    return new Promise(resolve => {
      commit('ADD_CACHEDVIEW', routeName)
      resolve()
    })
  },
  DelCacheViews ({ commit }, routeName) {
    return new Promise(resolve => {
      commit('DEL_CACHEDVIEW', routeName)
      resolve()
    })
  },
  ClearCacheViews ({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_CACHEVIEW')
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
