import { RouteRecordRaw } from 'vue-router'
import { BaseRoute } from './baseRoute'

/** 扩展 vue-router 添加自定义参数 */
export type AppRouteRecordRaw = RouteRecordRaw & BaseRoute
