import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PermService } from '../../system/perm/perm.service'
import { ForbiddenException } from '../exception/forbiddenException'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, @Inject('PermService') private readonly permSerivce: PermService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest()
    const user = req['user']
    if (!user) return false
    // 当前请求所需权限
    const currentPerm = this.reflector.get<string>('permissions', context.getHandler())
    // 空， 标识不需要权限
    if (!currentPerm) return true
    // 根据用户id 查询所拥有的权限
    const permList = await this.permSerivce.findUserPerms(user.id)
    const perms: string[] = []
    for (let i = 0, len = permList.length; i < len; i++) {
      permList[i]['m_perms'].indexOf(',') > -1 ? perms.push(...permList[i]['m_perms'].split(',')) : perms.push(permList[i]['m_perms'])
    }
    // currentPerm 有值，则需对比该用户所有权限
    // return perms.includes(currentPerm)
    // nestjs 原生 ForbiddenException 英文，不符合，所以抛出自定义异常
    if (perms.includes(currentPerm)) return true
    throw new ForbiddenException()
  }
}
