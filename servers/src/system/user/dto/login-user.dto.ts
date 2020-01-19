import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginUserDto {
  @ApiProperty()
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly account: string

  @ApiProperty()
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string
}
