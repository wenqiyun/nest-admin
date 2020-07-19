import { Controller, UseGuards, Post, Body, Get, Put, Delete, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'

import { RolesGuard } from '../../common/guards/roles.guard'
import { ResponseData } from '../../common/interfaces/result.interface'

import { JwtAuthGuard } from '../auth/auth.guard'

import { DeptService } from './dept.service'
import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
import { Permissions } from '../../common/decorators/permissions.decorator'

@ApiBearerAuth()
@ApiTags('部门管理')
@Controller('dept')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get('list')
  @ApiOperation({ summary: '查询所有部门，平级结构' })
  @Permissions('sys_dept:list')
  async findList(): Promise<ResponseData> {
    return this.deptService.findList()
  }

  @Post()
  @ApiOperation({ summary: '添加部门' })
  @Permissions('sys_dept:create')
  async create(@Body() deptData: CreateDeptDto): Promise<ResponseData> {
    return this.deptService.create(deptData)
  }

  @Put()
  @ApiOperation({ summary: '更新部门' })
  @Permissions('sys_dept:update')
  async update(@Body() deptData: UpdateDeptDto): Promise<ResponseData> {
    return this.deptService.update(deptData)
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据Id删除部门' })
  @Permissions('sys_dept:delete')
  async delete(@Param('id') id: number): Promise<ResponseData> {
    return this.deptService.delete(id)
  }
}
