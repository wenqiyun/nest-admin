import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator'

export class UpdateDeptDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '部门Id 不能为空' })
  readonly deptId: number

  @ApiProperty({ description: '上级部门ID, 无则默认为 0', uniqueItems: true })
  @IsNumber()
  readonly parentId: number

  @ApiProperty({ description: '部门名称', uniqueItems: true })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  readonly name: string

  @ApiProperty({ description: '排序' })
  @IsNumber()
  readonly orderNum: number

  @ApiProperty({ description: '是否删除' })
  @IsBoolean()
  readonly delFlag: boolean
}
