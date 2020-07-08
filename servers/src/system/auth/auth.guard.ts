import { AuthGuard } from '@nestjs/passport'
import { Logger } from '../../common/utils/log.util'
import { UserService } from '../user/user.service'
import { ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private readonly userService: UserService
  ) { super() }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    try {
      // 获取 accessToken
      const accessToken = request.get('Authorization')
      if (!accessToken) throw new UnauthorizedException('请先登录')
      // 验证 accessToken 是否过期, 未过期，将请求交给下一级
      const isValidAccessToken = await this.userService.verifyToken(accessToken.replace('Bearer ', ''))
      if (isValidAccessToken) return this.activate(context)
      // 获取 refreshToken
      const refreshToken = request.get('RefreshToken')
      if (!refreshToken) throw new UnauthorizedException('refreshToken 不存在')
      // 验证 当前 refreshToken 是否有效
      const isValidRefreshToken = await this.userService.verifyToken(refreshToken)
      if (!isValidRefreshToken) throw new UnauthorizedException('refreshToken 过期')
      // 查询用户
      const user = await this.userService.findOneById(isValidRefreshToken)
      if (user) {
        const tokens = await this.userService.refreshToken(isValidRefreshToken)
        // request headers 对象 prop 属性全自动转成小写，
        // 所以 获取 request.headers['authorization'] 或 request.get('Authorization') 
        // 重置属性 request.headers[authorization] = value
        request.headers['authorization'] = tokens.accessToken
        request.headers['refreshtoken'] = tokens.refreshToken
        // 在响应头中加入新的token，客户端判断响应头有无 Authorization 字段，有则重置
        response.header('Authorization', tokens.accessToken)
        response.header('refreshToken', tokens.refreshToken)

        // 将 当前请求交给下一级
        return this.activate(context)
      } else {
        throw new UnauthorizedException('用户不存在')
      }
      
    } catch (error) {
      Logger.error(`自动刷新token异常 ${error.message}`)
      return false
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>
  }

}

