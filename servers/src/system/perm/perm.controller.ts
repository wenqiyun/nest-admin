import { Controller, Request, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Permissions } from '../../common/decorators/permissions.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { ResponseData } from '../../common/interfaces/result.interface'

import { PermService } from './perm.service'
import { JwtAuthGuard } from '../auth/auth.guard'

@ApiBearerAuth()
@ApiTags('基础')
@Controller('perm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermController {
  constructor(private readonly permService: PermService) {}

  @Get('')
  @ApiOperation({ summary: '登录之后，查询用户所有菜单按钮权限' })
  @Permissions('')
  async getFrontEndPerm(@Request() req): Promise<ResponseData>  {
    const perms = await this.permService.findUserPerms(req['user'].id)
    return {
      statusCode: 200,
      message: '查询权限成功',
      data: {
        dynamicMenu: perms.map((v) => {
          return { type: v['m_type'], code: v['m_code'] }
        }),
        avatar: req['user'].avatar,
        nickname: req['user'].nickname
      }
    }
  }
}
