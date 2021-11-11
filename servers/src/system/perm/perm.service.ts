import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { Request, Router } from 'express'
import { getConnection } from 'typeorm'

import { ResultData } from '../../common/utils/result'
import { IRoute } from '../../common/interface/route.interface'

@Injectable()
export class PermService {
  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}

  /**
   * 查询个人 拥有的 api 权限
   * 查询生成语句
    SELECT
      `rm`.`id` AS `rm_id`,
      `rm`.`role_id` AS `rm_role_id`,
      `rm`.`menu_id` AS `rm_menu_id`,
      `mp`.`id` AS `mp_id`,
      `mp`.`menu_id` AS `mp_menu_id`,
      `mp`.`api_url` AS `mp_api_url`,
      `mp`.`api_method` AS `mp_api_method`
    FROM
      `sys_user_role` `ur`
      LEFT JOIN `sys_role_menu` `rm` ON `ur`.`role_id` = `rm`.`role_id`
      LEFT JOIN `sys_menu_perm` `mp` ON `rm`.`menu_id` = mp.menu_id
    WHERE
      `ur`.`user_id` = 1
      AND
      `mp`.`menu_id` != 1 -- 去除 null, 关于 mysql null 是 没有值，当 != 的时候 null 属于没有值而被过滤掉
   * @param userId
   * @returns
   */
  async findUserPerms(userId: number) {
    // mp.menu_id != 1 去掉 有些角色可能没有菜单， 查询的时候 为 null, 不能直接 ！null
    const perms = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu_perm', 'mp', 'rm.menu_id = mp.menu_id')
      .where('ur.user_id = :userId and mp.menu_id != 1', { userId })
      .getRawMany()

    return perms.map(v => ({ apiUrl: v.mp_api_url, apiMethod: v.mp_api_method }))
  }

  async findUserMenus(userId: number) {
    const menus = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu', 'm', 'rm.menu_id = m.id')
      .where('ur.user_id = :userId', { userId })
      .getRawMany()
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
    return ResultData.ok(routes)
  }

  async findAppAllRoutesBySwaggerApi(): Promise<IRoute[]> {
    // 暂时这样
    const { data } = await lastValueFrom(this.http.get(`http://localhost:${this.config.get('app.port')}/api/docs-json`))
    const routes = []
    if (data?.paths) {
      // 将 swagger 数据转换成需要的数据
      const paths = data.paths
      Object.keys(paths).forEach((path) => {
        Object.keys(paths[path]).forEach((method) => {
          const route = { path: path.replace(/\{/g, ':').replace(/\}/g, ''), method: method.toUpperCase(), desc: paths[path][method].summary }
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
