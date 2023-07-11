import { Controller, Post, Body, Get, Put, Delete, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { ApiResult } from '../../common/decorators/api-result.decorator'
import { ResultData } from '../../common/utils/result'

import { MenuService } from './menu.service'
import { MenuEntity } from './menu.entity'
import { MenuPermEntity } from './menu-perm.entity'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

@ApiTags('菜单与菜单权限管理')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/all')
  @ApiOperation({ summary: '得到所有菜单' })
  @ApiResult(MenuEntity, true)
  async findAllMenu(@Query('hasBtn') hasBtn: 0 | 1): Promise<ResultData> {
    return await this.menuService.findAllMenu(!!hasBtn)
  }

  @Get('one/:parentId/btns')
  @ApiOperation({ summary: '查询单个菜单下的所有按钮' })
  @ApiResult(MenuEntity, true)
  async findBtnByParentId(@Param('parentId') parentId: string): Promise<ResultData> {
    return await this.menuService.findBtnByParentId(parentId)
  }

  @Get('one/:id/menu-perm')
  @ApiOperation({ summary: '查询单个菜单权限' })
  @ApiResult(MenuPermEntity, true)
  async findMenuPerms(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.findMenuPerms(id)
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiResult()
  async create(@Body() dto: CreateMenuDto): Promise<ResultData> {
    return await this.menuService.create(dto)
  }

  @Put()
  @ApiOperation({ summary: '更新菜单' })
  @ApiResult()
  async updateMenu(@Body() dto: UpdateMenuDto): Promise<ResultData> {
    return await this.menuService.updateMenu(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.deleteMenu(id)
  }
}
