import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { pathToRegexp } from 'path-to-regexp'

import { CanActivate, Inject, ExecutionContext, Injectable } from '@nestjs/common'
import { PermService } from '../../system/perm/perm.service'
import { IPermDecorator } from '../decorators/perm-decorator.interface';


@Injectable()
export class RolesGuard implements CanActivate {
  private globalWhiteList = []
  constructor(
    private readonly reflector: Reflector,
    @Inject('PermService')
    private readonly permService: PermService,
    private readonly config: ConfigService,
  ) {
    this.globalWhiteList = [].concat(this.config.get<string[] | string>('perm.router.whitelist') || [])
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const currPerm = this.reflector.get<boolean>('perm', ctx.getHandler())
    // 设置 @Perm 且 传递的值 为 false 或 IPermDecorator 对象时 isWhite 为 true
    // 或 IPermDecorator isPerm 为 false 的时候 直接忽略 权限设置 return true
    // !currPerm 使用会包含 undefind 的情况
    if ((typeof currPerm === 'boolean' && currPerm === false) ||
        (currPerm as IPermDecorator)?.isWhite
        || (currPerm as IPermDecorator)?.isPerm === false) {
      return true
    }

    // 全局配置，
    const req = ctx.switchToHttp().getRequest()
    const isGlobal = this.config.get<string>('perm.model') === 'global'
    if (isGlobal) {
      const i = this.globalWhiteList.findIndex(route => {
        // 请求方法类型相同
        if (req.method.toUpperCase() === route.method.toUpperCase()) {
          // 对比 url
          return !!pathToRegexp(route.path).exec(req.url)
        }
        return false
      })
      // 在白名单内 则 进行下一步
      if (i > -1) return true
    }
    // 需要比对 该用户所拥有的 接口权限
    const user = req.user
    // 没有挈带 token 直接返回 false
    if (!user) return false
    const userPermApi = await this.permService.findAppAllRoutesBySwaggerApi()
    const index = userPermApi.findIndex(route => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.url)
      }
      return false
    })
    return index > -1
  }
}
