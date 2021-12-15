import { ApiProperty } from '@nestjs/swagger'

import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindRoleListDto extends ReqListQuery {
  @ApiProperty({ description: '角色名称', required: false })
  name?: string
}
