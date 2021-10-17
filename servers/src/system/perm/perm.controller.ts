import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { PermService } from './perm.service'

import { ResultData } from '../../common/utils/result'
import { Perm } from 'src/common/decorators/perm.decorator';

@ApiTags('权限路由相关')
@Controller('perm')
export class PermController {
  constructor(private readonly permService: PermService) {}

  @Get('all')
  @ApiOperation({ summary: '获取app 所有路由' })
  async findAppAllRoutes(): Promise<ResultData> {
    return await this.permService.findAppAllRoutes()
  }
}
