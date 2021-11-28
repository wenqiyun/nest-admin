export interface IRoute {
  /** 路由 path */
  path: string
  /** 路由方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 路由描述 */
  desc?: string
}
