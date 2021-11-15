import { Controller, Post, Body, Get, Put, Delete, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { ResultData } from '../../common/utils/result'

import { CreateMenuDto } from './dto/create-menu.dto'
import { MenuService } from './menu.service'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { UpdateMenuPermDto } from './dto/update-menu-perm.dto'

@ApiTags('菜单与菜单权限管理')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/all')
  @ApiOperation({ summary: '得到所有菜单' })
  async findAllMenu(@Query('hasBtn') hasBtn: 0 | 1): Promise<ResultData> {
    return await this.menuService.findAllMenu(!!hasBtn)
  }

  @Get('one/:parentId/btns')
  @ApiOperation({ summary: '查询单个菜单下的所有按钮' })
  async findBtnByParentId(@Param('parentId') parentId: string): Promise<ResultData> {
    return await this.menuService.findBtnByParentId(parentId)
  }

  @Get('one/:id/menu-perm')
  @ApiOperation({ summary: '查询单个菜单权限' })
  async findMenuPerms(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.findMenuPerms(id)
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  async create(@Body() dto: any): Promise<ResultData> {
    return await this.menuService.create(dto)
  }

  @Put()
  @ApiOperation({ summary: '更新菜单' })
  async updateMenu(@Body() dto: UpdateMenuDto): Promise<ResultData> {
    return await this.menuService.updateMenu(dto)
  }

  @Put('menu-perm')
  @ApiOperation({ summary: '更新菜单权限' })
  async updateMenuPerm(@Body() dto: UpdateMenuPermDto): Promise<ResultData> {
    return await this.menuService.updateMenuPerm(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  async delete(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.deleteMenu(id)
  }
}
