import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Allow, IsArray } from 'class-validator'
import { CreateRoleMenuDto } from '../../relationalEntities/roleMenu/dto/create-roleMenu.dto'

export class UpdateRoleDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '角色 ID 不能为空' })
  readonly roleId: number

  @ApiProperty({ description: '角色名称' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  readonly roleName: string

  @ApiProperty({ description: '备注' })
  @IsString({ message: '不是有效数据' })
  readonly remark: string

  @ApiProperty({ default: null, description: '部门ID，可为空' })
  @Allow()
  readonly deptId: number = null

  @ApiProperty({ description: '菜单用户关系等' })
  @IsArray()
  readonly roleMenus: CreateRoleMenuDto[]
}
