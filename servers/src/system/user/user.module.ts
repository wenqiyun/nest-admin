import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CryptoUtil } from 'src/common/utils/crypto.util'
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'
import { BaseController } from './base.controller'

// @Global() 当其他组件如 guards 需要使用  user 中的 service 等，则使用该注解
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    forwardRef(() => AuthModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT.secretKey'),
        signOptions: {
          expiresIn: config.get('JWT.expiresIn')
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [UserService, CryptoUtil],
  controllers: [UserController, BaseController],
  exports: [UserService]
})
export class UserModule {}
