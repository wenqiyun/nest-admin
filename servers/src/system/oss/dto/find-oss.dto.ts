import { ApiProperty } from '@nestjs/swagger'

import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindOssDto extends ReqListQuery {
  @ApiProperty({ description: '搜索条件，起始时间', required: false })
  startDay?: string

  @ApiProperty({ description: '搜索条件，结束时间', required: false })
  endDay?: string
}
