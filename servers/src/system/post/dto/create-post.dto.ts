import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '岗位编码' })
  @IsString({ message: 'code 类型错误，正确类型 string' })
  @IsNotEmpty({ message: 'code 不能为空' })
  readonly code: string

  @ApiProperty({ description: '岗位名称' })
  @IsString({ message: 'name 类型错误, 正确类型 string' })
  @IsNotEmpty({ message: 'name 不能为空' })
  readonly name: string

  @ApiProperty({ description: '排序' })
  @IsNumber({}, { message: 'orderNum 类型错误， 正确类型 number '})
  @Min(0)
  readonly orderNum: number

  @ApiProperty({ description: '备注'})
  @IsString({ message: 'remark 类型错误, 正确类型 string' })
  @IsOptional()
  readonly remark: string
}
