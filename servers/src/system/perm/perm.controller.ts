import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { ResultData } from '../../common/utils/result'
import { JwtAuthGuard } from '../auth/auth.guard'

import { PermService } from './perm.service'
@ApiTags('权限路由相关')
@ApiBearerAuth()
@Controller('perm')
@UseGuards(JwtAuthGuard)
export class PermController {
  constructor(private readonly permService: PermService) {}

  @Get('all')
  @ApiOperation({ summary: '获取app 所有路由' })
  async findAppAllRoutes(): Promise<ResultData> {
    return await this.permService.findAppAllRoutes()
  }

  @Get('user')
  @ApiOperation({ summary: '获取用户权限所有接口路由列表'})
  async findUserRoutes (@Req() req): Promise<ResultData> {
    const appRoutes = await this.permService.findUserPerms(req.user.id as string)
    return ResultData.ok(appRoutes)
  }

  @Get(':id')
  @ApiOperation({ summary: '用户权限'})
  async findUser (@Param('id') userId: string): Promise<any> {
    return await this.permService.findUserMenus(userId)
  }
}
