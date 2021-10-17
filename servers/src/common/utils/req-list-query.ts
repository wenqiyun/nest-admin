import { ApiProperty } from '@nestjs/swagger'

export class ReqListQuery {
  @ApiProperty({ description: '显示页数' })
  page: number

  @ApiProperty({ description: '每页显示条数' })
  size: number
}
