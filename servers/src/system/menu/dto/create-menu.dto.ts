import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsNotEmpty } from 'class-validator'

export class CreateMenuDto {
  @ApiProperty({ description: '上级部门ID, 无则默认为 0', uniqueItems: true })
  @IsNumber()
  readonly parentId: number

  @ApiProperty({ description: '菜单名称' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '菜单名称不能为空' })
  readonly name: string

  @ApiProperty({ description: '权限标识' })
  @IsString({ message: '不是有效数据' })
  readonly perms: string

  @ApiProperty({ description: '菜单类型， 1. 菜单/目录 2 tabs 3 按钮' })
  @IsNumber()
  @IsNotEmpty({ message: '菜单类型不能为空' })
  readonly type: number

  @ApiProperty({ description: '菜单按钮唯一标识' })
  @IsString({ message: '不是有效数据' })
  readonly code: string

  @ApiProperty({ description: '排序' })
  @IsNumber()
  readonly orderNum: number
}
