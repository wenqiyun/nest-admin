import { MenuPermDto } from './menu-perm.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsString } from 'class-validator';
export class UpdateMenuPermDto {
  @ApiProperty({ description: '菜单 id' })
  @IsString({ message: 'menuId 类型错误' })
  @IsNotEmpty({ message: 'menuId 不能为空' })
  menuId: string

  @ApiProperty({ description: '菜单权限接口列表' })
  @IsArray({ message: 'menuPerms 类型错误' })
  menuPerms: MenuPermDto[]
}
