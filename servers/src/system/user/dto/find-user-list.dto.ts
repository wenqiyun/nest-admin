import { ApiProperty } from '@nestjs/swagger'

import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindUserListDto extends ReqListQuery {
  @ApiProperty({ description: '账号模糊搜索', required: false })
  account?: string

  @ApiProperty({ description: '按账号状态查询用户', required: false })
  status?: number

  @ApiProperty({ description: '拥有角色id', required: false })
  roleId?: number

  @ApiProperty({ description: '当 roleId 不为空时有效，查询用户是否有当前权限', required: false })
  hasCurrRole?: 0 | 1
}
