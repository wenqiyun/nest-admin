import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class UpdatePasswordDto {
  userId: number
  password: string
}
