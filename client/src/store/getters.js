const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  cachedViews: state => state.cachedViews.cachedViews,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  isReq: state => state.user.isReq,
  dynamicMenu: state => state.user.dynamicMenu,
  tabMenu: state => state.user.tabMenu,
  btnMenu: state => state.user.btnMenu,
  permissionRoutes: state => state.permission.routes
}
export default getters
