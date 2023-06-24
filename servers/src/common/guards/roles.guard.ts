import { CanActivate, Inject, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { pathToRegexp } from 'path-to-regexp'

import { ALLOW_ANON } from '../decorators/allow-anon.decorator'
import { ALLOW_NO_PERM } from '../decorators/perm.decorator'

import { PermService } from '../../system/perm/perm.service'
import { UserType } from '../enums/common.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  private globalWhiteList = []
  constructor(
    private readonly reflector: Reflector,
    @Inject(PermService)
    private readonly permService: PermService,
    private readonly config: ConfigService,
  ) {
    this.globalWhiteList = [].concat(this.config.get('perm.router.whitelist') || [])
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 首先 无 token 的 是不需要 对比权限
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [ctx.getHandler(), ctx.getClass()])
    if (allowAnon) return true
    // 全局配置，
    const req = ctx.switchToHttp().getRequest()

    const i = this.globalWhiteList.findIndex((route) => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.url)
      }
      return false
    })
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    if (i > -1) return true
    // 函数请求头配置 AllowNoPerm 装饰器 无需验证权限
    const allowNoPerm = this.reflector.getAllAndOverride<boolean>(ALLOW_NO_PERM, [ctx.getHandler(), ctx.getClass()])
    if (allowNoPerm) return true

    // 需要比对 该用户所拥有的 接口权限
    const user = req.user
    // 没有挈带 token 直接返回 false
    if (!user) return false
    // 超管
    if (user.type === UserType.SUPER_ADMIN) return true

    const userPermApi = await this.permService.findUserPerms(user.id)
    const index = userPermApi.findIndex((route) => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        const reqUrl = req.url.split('?')[0]
        return !!pathToRegexp(route.path).exec(reqUrl)
      }
      return false
    })
    if (index === -1) new ForbiddenException('您无权限访问该接口')
    return true
  }
}
