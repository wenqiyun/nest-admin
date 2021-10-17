import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ResultData } from 'src/common/utils/result'

import { UserEntity } from './user.entity'
import { UserService } from './user.service'

import { LoginUser } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.dto'

@ApiTags('登录注册')
@Controller()
export class BaseController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiOkResponse({ type: UserEntity })
  async create(@Body() user: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(user)
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  async login(@Body() dto: LoginUser): Promise<ResultData> {
    return await this.userService.login(dto.account, dto.password)
  }
}
