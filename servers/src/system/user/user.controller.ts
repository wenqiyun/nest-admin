import { Controller, Query, Get, Param, Put, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express'

import { UserService } from './user.service'
import { UserEntity } from './user.entity'

import { ResultData } from '../../common/utils/result'

import { FindUserListDto } from './dto/find-user-list.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateOrUpdateRoleUsersDto } from './dto/createupdate-role-users.dto'
import { UpdateStatusDto } from './dto/update-status.dto'

@ApiTags('用户账号相关')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '查询用户列表' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findList (@Query() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto)
  }

  @Get('one/:id')
  @ApiOperation({ summary: '根据id 查询用户信息' })
  @ApiOkResponse({ type: UserEntity })
  @ApiParam({ name: 'id' })
  async findOne (@Param('id') id: string): Promise<ResultData> {
    return await this.userService.findOne(id)
  }

  @Get(':id/role')
  @ApiOperation({ summary: '查询用户角色id集合' })
  @ApiOkResponse({ type: Number, isArray: true })
  async findUserRole (@Param('id') id: string): Promise<ResultData> {
    return await this.userService.findUserRole(id)
  }

  @Post('role/update')
  @ApiOperation({ summary: '角色添加/取消关联用户' })
  async createOrCancelUserRole (@Body() dto: CreateOrUpdateRoleUsersDto): Promise<ResultData> {
    return await this.userService.createOrCancelUserRole(dto.userIds, dto.roleId, dto.type)
  }

  @Put()
  @ApiOperation({ summary: '更新用户信息' })
  async update (@Body() dto: UpdateUserDto): Promise<ResultData> {
    return await this.userService.update(dto)
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改用户可用状态' })
  async updateStatus (@Body() dto: UpdateStatusDto): Promise<ResultData> {
    return await this.userService.updateStatus(dto.id, dto.status)
  }

  @Put('/password/reset/:userId')
  @ApiOperation({ summary: '重置用户密码' })
  async resetPassword (@Param('userId') userId: string): Promise<ResultData> {
    return await this.userService.updatePassword(userId, '', true)
  }

  @Post('/import')
  @ApiOperation({ summary: 'excel 批量导入用户' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importUsers (@UploadedFile() file: Express.Multer.File): Promise<ResultData> {
    return await this.userService.importUsers(file)
  }
}
