import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Router } from 'express'
import { getConnection } from 'typeorm'

import { ResultData } from '../../common/utils/result'
import { IRoute } from '../../common/interface/route.interface'

@Injectable()
export class PermService {
  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}

  async findUserPerms(userId: number) {
    const perms = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu_perm', 'mp', 'rm.menu_id = m.menu_id')
      .where('ur.user_id = :userId', { userId })
    return perms
  }

  async findUserMenus(userId: number) {
    const menus = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu', 'm', 'rm.menu_id = m.id')
      .where('ur.user_id = :userId', { userId })
    return menus
  }

  // 从 express router 堆栈中拿到所有路由，供前端选择，设置相应的权限
  // 但是从堆栈拿出来的数据路由是没有描述
  async findAppAllRoutesByStack(req: Request): Promise<ResultData> {
    const router = req.app._router as Router
    const routes = router.stack
      .map((layer) => {
        if (layer.route) {
          const path = layer.route.path
          const method = layer.route.stack[0].method.toUpperCase()
          return { path, method }
        }
        return null
      })
      .filter((v) => !!v)
    console.log(router.stack, 900090)
    return ResultData.ok(routes)
  }

  async findAppAllRoutesBySwaggerApi(): Promise<IRoute[]> {
    // 暂时这样
    const { data } = await this.http.get(`http://localhost:${this.config.get('app.port')}/api/docs-json`).toPromise()
    const routes = []
    if (data?.paths) {
      // 将 swagger 数据转换成需要的数据
      const paths = data.paths
      Object.keys(paths).forEach((path) => {
        Object.keys(paths[path]).forEach((method) => {
          const route = { path: path.replace(/\{/g, ':').replace(/\}/g, ''), method, desc: paths[path][method].summary }
          routes.push(route)
        })
      })
    }
    return routes
  }

  async findAppAllRoutes () {
    const routes = await this.findAppAllRoutesBySwaggerApi()
    return ResultData.ok(routes)
  }
}
