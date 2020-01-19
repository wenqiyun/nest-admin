import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsString, MinLength, IsEmail, IsBoolean, IsArray } from 'class-validator'
import { CreateUserRoleDto } from '../../relationalEntities/userRole/dto/create-userRole.dto'

export class UpdateUserDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '用户ID不能为空' })
  readonly id: number

  @ApiProperty()
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @MinLength(2, { message: '昵称至少需要两位' })
  readonly nickname: string

  @ApiProperty()
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少需要三位' })
  readonly account: string

  @ApiProperty()
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  readonly phoneNum: string

  @ApiProperty()
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '头像地址不能为空' })
  readonly avatar: string

  @ApiProperty()
  @IsNumber()
  readonly deptId: number

  @ApiProperty()
  @IsBoolean({ message: '必须为布尔值类型' })
  @IsNotEmpty({ message: '用户状态不能为空' })
  readonly status: boolean

  @ApiProperty()
  @IsArray()
  readonly userRoles: CreateUserRoleDto[]
}
