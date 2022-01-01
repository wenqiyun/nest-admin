import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsIn, IsNumberString } from 'class-validator'
import { StatusValue } from '../../../common/enums/common.enum';

export class  UpdateUserDto {
  @ApiProperty({ description: '用户编码' })
  @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'id 不能为空' })
  readonly id: string

  @ApiProperty({ description: '所属状态: 1-有效，0-禁用', enum: StatusValue, required: false })
  @IsNumber({}, { message: 'status 类型错误，正确类型 number' })
  @IsOptional()
  @IsIn([StatusValue.NORMAL, StatusValue.FORBIDDEN], { message: 'status 可选值0/1，分别表示有效禁用' })
  readonly status?: StatusValue

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

  @ApiProperty({ description: '头像', required: false })
  @IsString({ message: 'avatar 类型错误，正确类型 string' })
  @IsOptional()
  readonly avatar?: string

  @ApiProperty({ description: '角色 id 集合', required: false })
  @IsString( { each: true, message: '角色id集合中存在类型错误，正确类型 string[]' })
  @IsOptional()
  readonly roleIds?: string[]
}
