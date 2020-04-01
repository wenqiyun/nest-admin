import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'
import { AuthStrategy } from './auth.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule) // 处理模块间的循环依赖
  ],
  providers: [AuthService, AuthStrategy],
  exports: [PassportModule, AuthService] // 导出 authService 供 UserModule 使用
})
export class AuthModule {}
