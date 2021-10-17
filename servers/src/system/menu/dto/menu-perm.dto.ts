import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsIn } from 'class-validator'

export class MenuPermDto {
  @ApiProperty({ description: 'api method 值 POST PUT GET DELETE' })
  @IsString({ message: 'apiMethod 类型错误' })
  @IsNotEmpty({ message: 'apiMethod 不能为空' })
  @IsIn(['GET', 'POST', 'PUT', 'DELETE'])
  readonly apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE'

  @ApiProperty({ description: 'api url' })
  @IsString({ message: 'apiUrl 类型错误' })
  @IsNotEmpty({ message: 'apiUrl 不能为空' })
  readonly apiUrl: string
}
