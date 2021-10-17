import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsIn } from 'class-validator'

export class  UpdateUserDto {
  @ApiProperty({ description: '用户编码' })
  @IsNumber({}, { message: 'id 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'id 不能为空' })
  readonly id: number

  @ApiProperty({ description: '密码', required: false })
  @IsString({ message: 'password 类型错误，正确类型 string' })
  @IsOptional()
  password?: string

  @ApiProperty({ description: '所属状态: 1-有效，0-禁用', required: false })
  @IsNumber({}, { message: 'status 类型错误，正确类型 number' })
  @IsOptional()
  @IsIn([0, 1], { message: 'status 可选值0/1，分别表示有效禁用' })
  readonly status?: 1 | 0

  @ApiProperty({ description: '手机号', required: false })
  @IsString({ message: 'phoneNum 类型错误，正确类型 string' })
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '请输入正确的手机号' })
  // @IsPhoneNumber('CH', { message: '请输入正确的手机号' })
  @IsOptional()
  readonly phoneNum?: string

  @ApiProperty({ description: '邮箱', required: false })
  @IsString({ message: 'email 类型错误，正确类型 string' })
  @IsEmail()
  @IsOptional()
  readonly email?: string

  @ApiProperty({ description: '确认密码', required: false })
  @IsString({ message: ' confirmPassword 类型错误，正确类型 string' })
  @IsOptional()
  readonly confirmPassword?: string

  @ApiProperty({ description: '头像', required: false })
  @IsString({ message: 'avatar 类型错误，正确类型 string' })
  @IsOptional()
  readonly avatar?: string
}
