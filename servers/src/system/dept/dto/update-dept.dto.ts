import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, Min, IsOptional, IsNumberString, IsIn, MinLength, MaxLength } from 'class-validator'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../../common/enums/common.enum'

export class UpdateDeptDto {
  @ApiProperty({ description: 'id' })
  @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
  id: string

  @ApiProperty({ description: '上级部门 id', required: false })
  @IsNumberString({}, { message: 'parentId 类型错误，正确类型 string' })
  @IsOptional()
  parentId?: string

  @ApiProperty({ description: '部门名称', required: false })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @MinLength(2, { message: '账号至少2个字符' })
  @MaxLength(50, { message: '账号最多50个字符' })
  @IsOptional()
  name?: string

  @ApiProperty({ description: '部门负责人', required: false })
  @IsString({ message: 'leader 类型错误，正确类型 string' })
  @IsOptional()
  readonly leader?: string

  @ApiProperty({ description: '备注', required: false })
  @IsString({ message: 'remark  类型错误，正确类型 string' })
  @IsOptional()
  readonly remark?: string

  @ApiProperty({ description: '状态', enum: $enum(StatusValue).getValues(), required: false })
  @IsNumber({}, { message: 'status 类型错误， 正确类型 number ' })
  @IsIn($enum(StatusValue).getValues())
  @IsOptional()
  status?: StatusValue

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: 'orderNum 类型错误， 正确类型 number ' })
  @Min(0)
  @IsOptional()
  orderNum?: number
}
