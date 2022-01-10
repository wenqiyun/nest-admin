import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, Min, IsOptional, IsNumberString, IsIn } from 'class-validator';
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../../common/enums/common.enum'

export class UpdatePostDto {

  @ApiProperty({ description: 'id' })
  @IsNumberString({}, { message: 'id 类型错误，正确类型 string' })
  readonly id: string

  @ApiProperty({ description: '部门名称', required: false })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsOptional()
  readonly name?: string

  @ApiProperty({ description: '岗位编码' })
  @IsString({ message: 'code 类型错误，正确类型 string' })
  @IsOptional()
  readonly code?: string

  @ApiProperty({ description: '状态', enum: $enum(StatusValue).getValues(), required: false})
  @IsNumber({}, { message: 'status 类型错误， 正确类型 number '})
  @IsIn($enum(StatusValue).getValues())
  @IsOptional()
  readonly status?: StatusValue

  @ApiProperty({ description: '排序', required: false })
  @IsNumber({}, { message: 'orderNum 类型错误， 正确类型 number '})
  @Min(0)
  @IsOptional()
  readonly orderNum?: number

  @ApiProperty({ description: '备注', required: false })
  @IsString({ message: 'remark 类型错误, 正确类型 string' })
  @IsOptional()
  readonly remark?: string
}
