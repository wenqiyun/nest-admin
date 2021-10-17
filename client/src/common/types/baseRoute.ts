import { RouteMeta } from 'vue-router'
import { AppRouteRecordRaw } from './appRoute.type'

type Meta = {
  /** 当前路由的 title，做显示用，name 则作为 路由的唯一标识 */
  title: string
  /** 当前路由的 icon */
  icon?: string
  /** 当前路由是否固定在 tagsView  */
  affix?: string
  /** activeMenu 设置路由 path , 则左侧菜单栏 path 高亮  */
  activeMenu?: string
}

export type BaseRoute = {
  /** 当前路由是否隐藏 */
  hidden?: boolean
  children?: Array<AppRouteRecordRaw>
  meta?: RouteMeta & Meta,
  /** 总是显示该路由 */
  alwaysShow?: boolean
  /** 不显示子级路由 */
  noShowingChildren?: boolean
}
