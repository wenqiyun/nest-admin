import { Controller, Get, Query, Body, Param, Delete, Put, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RolesGuard } from '../../common/guards/roles.guard'
import { Permissions } from '../../common/decorators/permissions.decorator'
import { ResponseData } from '../../common/interfaces/result.interface'

import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { JwtAuthGuard } from '../auth/auth.guard'

@ApiBearerAuth()
@ApiTags('角色管理')
@Controller('role')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @ApiOperation({ summary: '查询所有角色' })
  @Permissions('sys_role:all')
  async findAllList(): Promise<ResponseData> {
    return this.roleService.findAllList()
  }

  @Get('list')
  @ApiOperation({ summary: '查询角色列表' })
  @Permissions('sys_role:list')
  async findList(@Query() query): Promise<ResponseData>  {
    return this.roleService.findList(query.pageSize || 10, query.pageNum || 1, query.roleName || null)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询角色详情' })
  @Permissions('sys_role:list')
  async findOne(@Param('id') id: number): Promise<ResponseData>  {
    return this.roleService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @Permissions('sys_role:create')
  async create(@Body() role: CreateRoleDto): Promise<ResponseData>  {
    return this.roleService.createRole(role)
  }

  @Put()
  @ApiOperation({ summary: '更新角色信息' })
  @Permissions('sys_role:update')
  async update(@Body() roleData: UpdateRoleDto): Promise<ResponseData>  {
    return this.roleService.updateRole(roleData)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @Permissions('sys_role:delete')
  async delete(@Param('id') id: number): Promise<ResponseData>  {
    return this.roleService.deleteRole(id)
  }
}
