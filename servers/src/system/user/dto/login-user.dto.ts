import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginUser {
  @ApiProperty({ description: '账号' })
  @IsString({ message: 'account 类型错误' })
  @IsNotEmpty({ message: '账号不能为空' })
  readonly account: string

  @ApiProperty({ description: '密码' })
  @IsString({ message: 'password 类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string
}
