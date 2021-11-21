import { Controller, Get, Post, Put, Query, Param, Delete, Body, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'

import { ResultData } from '../../common/utils/result'

import { FindRoleListDto } from './dto/find-role-list.dto'
import { RoleService } from './role.service'
import { RoleEntity } from './role.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('list')
  @ApiOperation({ summary: '查询 role 列表' })
  @ApiOkResponse({ type: RoleEntity, isArray: true })
  async findList(@Req() req): Promise<ResultData> {
    return await this.roleService.findList(req.user.type, req.user.id)
  }

  @Get('one/:id/perms')
  @ApiOperation({ summary: '查询单个角色详情及权限菜单' })
  @ApiOkResponse({ type: RoleEntity })
  async findOne(@Param('id') id: string): Promise<ResultData> {
    return await this.roleService.findOnePerm(id)
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  async create(@Body() dto: CreateRoleDto, @Req() req): Promise<ResultData> {
    return await this.roleService.create(dto, req.user)
  }

  @Put()
  @ApiOperation({ summary: '更新角色' })
  async update(@Body() dto: UpdateRoleDto): Promise<ResultData> {
    return await this.roleService.update(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  async delete(@Param('id') id: string): Promise<ResultData> {
    return await this.roleService.delete(id)
  }
}
