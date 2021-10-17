import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsString, IsIn } from 'class-validator'
export class CreateOrUpdateRoleUsersDto {
  @ApiProperty({ description: 'user id 集合' })
  @IsNumber({}, { each: true, message: 'userIds 集合中有类型错误' })
  @IsNotEmpty({ message: 'userIds 不能为空' })
  userIds: number[]

  @ApiProperty({ description: 'juese id' })
  @IsNumber({}, { message: 'roleId 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'roleId 不能为空' })
  roleId: number

  @ApiProperty({ description: 'juese id' })
  @IsString({ message: 'type 类型错误，正确类型 string' })
  @IsIn(['create', 'cancel'], { message: '可选值为 create / cancel' })
  type: 'create' | 'cancel'
}
