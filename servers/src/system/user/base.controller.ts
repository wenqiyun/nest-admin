import { Body, Post, Controller } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ResponseData } from '../../common/interfaces/result.interface'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

@ApiTags('登录注册')
@Controller()
export class BaseController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async create(@Body() userData: CreateUserDto): Promise<ResponseData> {
    return this.userService.create(userData)
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() userData: LoginUserDto): Promise<ResponseData> {
    return this.userService.login(userData)
  }
}
