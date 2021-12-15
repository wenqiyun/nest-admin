import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, Length, IsNotEmpty, IsOptional, IsArray } from 'class-validator'

export class UpdateRoleDto {
  @ApiProperty({ description: 'id' })
  @IsString({ message: 'id 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'id 不能为空' })
  id: string

  @ApiProperty({ description: '角色名称' })
  @IsString({ message: 'remark 类型错误, 正确类型 string' })
  @Length(2, 20, { message: 'name 字符长度在 2~20' })
  name?: string

  @ApiProperty({ description: '角色备注', required: false })
  @IsString({ message: 'remark 类型错误, 正确类型 string' })
  @Length(0, 100, { message: 'name 字符长度在 0~100' })
  @IsOptional()
  remark?: string

  @ApiProperty({ description: '当前角色所拥有的菜单组', required: false })
  @IsArray({ message: 'menuIds 类型错误，正确类型 string[]' })
  @IsString({ each: true, message: '菜单组内类型错误' })
  @IsNotEmpty({ each: true, message: '菜单id 不能为空' })
  @IsOptional()
  menuIds?: number[]
}
