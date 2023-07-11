import { ApiProperty } from '@nestjs/swagger'

export class CreateTokenDto {
  @ApiProperty({ description: 'token' })
  accessToken: string
  @ApiProperty({ description: '刷新 token' })
  refreshToken: string
}
