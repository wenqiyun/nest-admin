import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateDeptDto {
  @ApiProperty({ description: '上级部门 id' })
  @IsString({ message: 'parentId 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'parentId 不能为空' })
  readonly parentId: string

  @ApiProperty({ description: '部门名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'name 不能为空' })
  readonly name: string

  @ApiProperty({ description: '部门负责人' })
  @IsString({ message: 'leader 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'leader 不能为空' })
  readonly leader: string

  @ApiProperty({ description: '备注', required: false })
  @IsString({ message: 'remark  类型错误，正确类型 string' })
  @IsOptional()
  remark?: string

  @ApiProperty({ description: '排序' })
  @IsNumber({}, { message: 'orderNum 类型错误， 正确类型 number '})
  @Min(0)
  readonly orderNum: number
}
