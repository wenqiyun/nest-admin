import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsIn, IsString } from 'class-validator'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../../common/enums/common.enum'

export class UpdateStatusDto {
  @ApiProperty({ description: '用户编码' })
  @IsString({ message: 'id 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'id 不能为空' })
  readonly id: string

  @ApiProperty({ description: '所属状态: 1-有效，0-禁用', enum: $enum(StatusValue).getValues() })
  @IsNumber({}, { message: 'status 类型错误，正确类型 number' })
  @IsNotEmpty({ message: 'status 不能为空' })
  @IsIn([0, 1], { message: 'status 可选值0/1，分别表示有效禁用' })
  readonly status: StatusValue
}
