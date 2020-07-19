import { Controller, Get, Param, Body, Post, Put, Delete, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

import { ResponseData } from '../../common/interfaces/result.interface'
import { Permissions } from '../../common/decorators/permissions.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../auth/auth.guard'

import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

@ApiBearerAuth()
@ApiTags('菜单管理')
@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('list/nobtns')
  @ApiOperation({ summary: '查询所有菜单，不包含按钮，平级结构，用户端转树' })
  @Permissions('sys_menu:list')
  async findMenuList(): Promise<ResponseData> {
    return this.menuService.findMenuList(3)
  }

  @Get('list')
  @ApiOperation({ summary: '查询所有菜单，平级结构，用户端转树' })
  @Permissions('sys_menu:list')
  async findList(): Promise<ResponseData> {
    return this.menuService.findMenuList(0)
  }

  @Get(':menuId/btns')
  @ApiOperation({ summary: '查询菜单下的所属按钮' })
  @Permissions('sys_menu:list')
  async findBtnList(@Param('menuId') menuId: number): Promise<ResponseData> {
    return this.menuService.findBtnList(menuId)
  }

  @Get(':menuId')
  @ApiOperation({ summary: '查询菜单详情' })
  @Permissions('sys_menu:list')
  async findOne(@Param('menuId') menuId: number): Promise<ResponseData> {
    return this.menuService.findOne(menuId)
  }

  @Post()
  @ApiOperation({ summary: '创建菜单、按钮等' })
  @Permissions('sys_menu:create')
  async create(@Body() menuData: CreateMenuDto): Promise<ResponseData> {
    return this.menuService.create(menuData)
  }

  @Put()
  @ApiOperation({ summary: '更新菜单、按钮信息' })
  @Permissions('sys_menu:update')
  async update(@Body() menuData: UpdateMenuDto): Promise<ResponseData> {
    return this.menuService.update(menuData)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单、按钮信息' })
  @Permissions('sys_menu:delete')
  async delete(@Param('id') id: number): Promise<ResponseData> {
    return this.menuService.delete(id)
  }
}
