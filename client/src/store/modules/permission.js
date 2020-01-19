import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (dynamicMenu, route) {
  if (route.name) {
    return dynamicMenu.findIndex(menu => {
      if (menu === null) {
        return false
      } else {
        return menu === route.name
      }
    }) > -1
  } else if (route.hidden) {
    return true
  } else if (route.children && route.children.length > 0 && hasPermission(dynamicMenu, route.children[0])) {
    return true
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, dynamicMenu) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(dynamicMenu, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, dynamicMenu)
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
  }
}

const actions = {
  generateRoutes ({ commit }, dynamicMenu) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, dynamicMenu)
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
