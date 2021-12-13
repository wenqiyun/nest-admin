import { ApiProperty } from '@nestjs/swagger'

export class RouteDto {
  /** 路由 path */
  @ApiProperty({ description: 'api 路径' })
  path: string
  /** 路由方法 */
  @ApiProperty({ description: 'api 方法' })
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 路由描述 */
  @ApiProperty({ description: 'api 描述说明', required: false })
  desc?: string
}
