import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsNumber, IsString, Min, IsNotEmpty, Length, IsNumberString } from 'class-validator';
import { $enum } from 'ts-enum-util'

import { MenuType } from '../../../common/enums/common.enum'

import { MenuPermDto } from './menu-perm.dto'

export class CreateMenuDto {
  @ApiProperty({ description: '父级菜单' })
  @IsNumberString({}, { message: 'parent 类型错误' })
  @IsNotEmpty({ message: 'parentId 必须填入值' })
  readonly parentId: string

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  @Length(2, 20, { message: 'name 字符长度在 2~20' })
  readonly name: string

  @ApiProperty({ description: '菜单唯一标识，前端控制页面显隐' })
  @IsString({ message: 'code 类型错误，正确类型 string' })
  readonly code: string


  @ApiProperty({ description: '菜单类型 1-菜单/目录 2-tabs 3-按钮', enum: $enum(MenuType).getValues(), required: false })
  @IsNumber({}, { message: 'type 类型错误' })
  @IsIn($enum(MenuType).getValues(), { message: 'type 的值只能是 1/2/3，且分别表示菜单/tabs/按钮' })
  readonly type: MenuType

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: '排序传值错误' })
  @Min(0)
  readonly orderNum: number

  @ApiProperty({ description: '菜单接口路径权限' })
  @IsArray({ message: '菜单权限是数组格式' })
  readonly menuPermList: MenuPermDto[]
}
