import { $enum } from 'ts-enum-util'
import { ApiProperty } from '@nestjs/swagger'

import { StatusValue } from '../../../common/enums/common.enum'
import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindPostListDto extends ReqListQuery {
  @ApiProperty({ description: '岗位名称', required: false })
  name?: string

  @ApiProperty({ description: '岗位编码', required: false })
  code?: string

  @ApiProperty({ description: '状态 0-禁用，1-正常使用', enum: $enum(StatusValue).getValues(), required: false })
  status?: StatusValue
}
