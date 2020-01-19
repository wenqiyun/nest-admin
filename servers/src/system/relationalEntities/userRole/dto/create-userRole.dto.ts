import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class CreateUserRoleDto {
  @ApiProperty()
  @IsNumber()
  userId: number

  @ApiProperty()
  @IsNumber()
  roleId: number
}
