import { Controller, UseGuards, Post, Body, Get, Put, Delete, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../commin/guards/roles.guard'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DeptService } from './dept.service'
import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
import { Permissions } from '../../commin/decorators/permissions.decorator'

@ApiBearerAuth()
@ApiTags('部门管理')
@Controller('dept')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Get('list')
  @ApiOperation({ summary: '查询所有部门，平级结构' })
  @Permissions('sys_dept:list')
  async findList() {
    return this.deptService.findList()
  }

  @Post()
  @ApiOperation({ summary: '添加部门' })
  @Permissions('sys_dept:create')
  async create(@Body() deptData: CreateDeptDto) {
    return this.deptService.create(deptData)
  }

  @Put()
  @ApiOperation({ summary: '更新部门' })
  @Permissions('sys_dept:update')
  async update(@Body() deptData: UpdateDeptDto) {
    return this.deptService.update(deptData)
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据Id删除部门' })
  @Permissions('sys_dept:delete')
  async delete(@Param('id') id: number) {
    return this.deptService.delete(id)
  }
}
