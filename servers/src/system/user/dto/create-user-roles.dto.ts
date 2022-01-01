import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateOrUpdateUserRolesDto {
  @ApiProperty({ description: '用户id' })
  @IsNumberString({}, { message: 'userId 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'userId 不能为空' })
  userId: string

  @ApiProperty({ description: '角色id 集合' })
  @IsNumberString({}, { each: true, message: '角色id集合中存在类型错误，正确类型 string[]' })
  @IsNotEmpty({ each: true, message: '角色id集合中存在为空' })
  roleIds: string[]
}
