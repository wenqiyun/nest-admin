import { MenuPermDto } from './menu-perm.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsArray } from 'class-validator'
export class UpdateMenuPermDto {
  @ApiProperty({ description: '菜单 id' })
  @IsNumber({}, { message: 'menuId 类型错误' })
  @IsNotEmpty({ message: 'menuId 不能为空' })
  menuId: number

  @ApiProperty({ description: '菜单权限接口列表' })
  @IsArray({ message: 'menuPerms 类型错误' })
  menuPerms: MenuPermDto[]
}
