import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty } from 'class-validator'

export class CreateOrUpdateUserRolesDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'userId 不能为空' })
  userId: number

  @ApiProperty({ description: '角色id 集合' })
  @IsNumber({}, { each: true, message: '角色id集合中存在类型错误，正确类型 number[]' })
  @IsNotEmpty({ each: true, message: '角色id集合中存在为空' })
  roleIds: number[]
}
