import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { ALLOW_ANON } from '../decorators/allow-anon.decorator'

import { UserService } from '../../system/user/user.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService)
    private readonly userService: UserService
  ) {
    super()
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 函数，类 是否允许 无 token 访问
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [ctx.getHandler(), ctx.getClass()])
    if (allowAnon) return true
    const req = ctx.switchToHttp().getRequest()
    // const res = ctx.switchToHttp().getResponse()
    const accessToken = req.get('Authorization')
    if (!accessToken) throw new ForbiddenException('请先登录')
    const atUserId = this.userService.verifyToken(accessToken)
    if (!atUserId) throw new UnauthorizedException('当前登录已过期，请重新登录')
    return this.activate(ctx)
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>
  }
}
