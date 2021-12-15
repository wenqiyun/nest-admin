import { ApiProperty } from '@nestjs/swagger'

import { ReqListQuery } from '../../../common/utils/req-list-query'

export class FindUserListDto extends ReqListQuery {
  @ApiProperty({ description: '账号模糊搜索', required: false })
  account?: string

  @ApiProperty({ description: '按账号状态查询用户',enum: [0,1], required: false })
  status?: 0 | 1

  @ApiProperty({ description: '拥有角色id', required: false })
  roleId?: string

  @ApiProperty({ description: '当 roleId 不为空时有效，查询用户是否有当前权限 0-无当前角色 1-有当前角色', required: false })
  hasCurrRole?: 0 | 1
}
