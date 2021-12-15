import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiExtraModels } from '@nestjs/swagger'

import { ResultData } from '../../common/utils/result'
import { AllowAnon } from '../../common/decorators/allow-anon.decorator'
import { ApiResult } from '../../common/decorators/api-result.decorator'

import { UserEntity } from './user.entity'
import { UserService } from './user.service'

import { LoginUser } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { CreateTokenDto } from './dto/create-token.dto'

@ApiTags('登录注册')
@ApiExtraModels(ResultData, UserEntity, CreateTokenDto)
@Controller()
export class BaseController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResult(UserEntity)
  @AllowAnon()
  async create(@Body() user: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(user)
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult(CreateTokenDto)
  @AllowAnon()
  async login(@Body() dto: LoginUser): Promise<ResultData> {
    return await this.userService.login(dto.account, dto.password)
  }

  @Post('/update/token')
  @ApiOperation({ summary: '刷新token'})
  @ApiResult(CreateTokenDto)
  @ApiBearerAuth()
  async updateToken (@Req() req): Promise<ResultData> {
    return await this.userService.updateToken(req.user.id)
  }
}
