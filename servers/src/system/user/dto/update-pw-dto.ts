import { IsString, IsNotEmpty, Allow } from 'class-validator'

export class UpdatePwDto {
  @Allow()
  id: number

  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '原密码不能为空' })
  oldPassword: string

  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string

  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string
}
