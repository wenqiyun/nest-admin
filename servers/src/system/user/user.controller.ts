import { Controller, Query, Get, Param, Put, Body, Post, UseInterceptors, UploadedFile, HttpCode, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse, ApiBody, ApiConsumes, ApiQuery, ApiExtraModels } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { UserService } from './user.service'
import { UserRoleService } from './user-role.service'
import { UserEntity } from './user.entity'

import { ResultData } from '../../common/utils/result'
import { ApiResult } from '../../common/decorators/api-result.decorator'

import { FindUserListDto } from './dto/find-user-list.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateOrUpdateRoleUsersDto } from './dto/createupdate-role-users.dto'
import { UpdateStatusDto } from './dto/update-status.dto'

@ApiTags('用户账号相关')
@ApiExtraModels(ResultData, UserEntity)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService
  ) {}

  @Get('list')
  @ApiOperation({ summary: '查询用户列表' })
  @ApiResult(UserEntity, true, true)
  async findList (@Query() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto)
  }

  @Get('one/info')
  @ApiOperation({ summary: '根据id查询用户信息' })
  @ApiQuery({ name: 'id' })
  @ApiResult(UserEntity)
  async findOne (@Query('id') id: string, @Req() req): Promise<ResultData> {
    return await this.userService.findOne(id || req.user.id)
  }

  @Get(':id/role')
  @ApiOperation({ summary: '查询用户角色id集合' })
  @ApiResult(Number, true)
  async findUserRole (@Param('id') id: string): Promise<ResultData> {
    return await this.userRoleService.findUserRole(id)
  }

  @Post('role/update')
  @ApiOperation({ summary: '角色添加/取消关联用户' })
  @ApiResult()
  async createOrCancelUserRole (@Body() dto: CreateOrUpdateRoleUsersDto): Promise<ResultData> {
    return await this.userRoleService.createOrCancelUserRole(dto.userIds, dto.roleId, dto.type)
  }

  @Put()
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResult()
  async update (@Body() dto: UpdateUserDto): Promise<ResultData> {
    return await this.userService.update(dto)
  }

  @Put('/status/change')
  @ApiOperation({ summary: '更改用户可用状态' })
  @ApiResult()
  async updateStatus (@Body() dto: UpdateStatusDto, @Req() req): Promise<ResultData> {
    return await this.userService.updateStatus(dto.id, dto.status, req.user.id)
  }

  @Put('/password/reset/:userId')
  @ApiOperation({ summary: '重置用户密码' })
  @ApiResult()
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
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResult(UserEntity, true)
  async importUsers (@UploadedFile() file: Express.Multer.File): Promise<ResultData> {
    return await this.userService.importUsers(file)
  }
}
