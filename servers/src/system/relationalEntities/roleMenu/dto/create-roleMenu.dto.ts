import { ApiProperty } from '@nestjs/swagger'
export class CreateRoleMenuDto {
  @ApiProperty({ description: '角色Id' })
  roleId: number

  @ApiProperty({ description: '菜单ID' })
  menuId: number
}
