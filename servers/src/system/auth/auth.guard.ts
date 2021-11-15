import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtUtilService } from '../jwt/jwt.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtUtilService: JwtUtilService
  ) {
    super()
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest()
    // const res = ctx.switchToHttp().getResponse()
    const accessToken = req.get('Authorization')
    if (!accessToken) throw new ForbiddenException('请先登录')
    const atUserId = this.jwtUtilService.verifyToken(accessToken)
    if (!atUserId) throw new UnauthorizedException('当前登录已过期，请重新登录')
    return this.activate(ctx)

      // const refreshToken = req.get('RefreshToken')
      // const rtUserId = this.userService.verifyToken(refreshToken)
      // if (!rtUserId) throw new UnauthorizedException('当前登录已过期，请重新登录')
      // const user = await this.userService.findOneById(rtUserId)
      // if (user) {
      //   const tokens = this.userService.genToken({ id: rtUserId })
      //   // request headers 对象 prop 属性全自动转成小写，
      //   // 所以 获取 request.headers['authorization'] 或 request.get('Authorization')
      //   // 重置属性 request.headers[authorization] = value
      //   req.headers['authorization'] = tokens.accessToken
      //   req.headers['refreshtoken'] = tokens.refreshToken
      //   // 在响应头中加入新的token，客户端判断响应头有无 Authorization 字段，有则重置
      //   res.header('Authorization', tokens.accessToken)
      //   res.header('RefreshToken', tokens.refreshToken)
      //   // 将当前请求交给下一级
      //   return this.activate(ctx)
      // } else {
      //   throw new UnauthorizedException('用户不存在')
      // }

  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>
  }
}
