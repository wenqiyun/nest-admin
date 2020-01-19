import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CryptoUtil } from 'src/commin/utils/crypto.util'
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'
import { BaseController } from './base.controller'

// @Global() 当其他组件如 guards 需要使用  user 中的 service 等，则使用该注解
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: 'secretKey',
      // 向 nest 容器注入 jwt 模块 ， 并配密钥和令牌有效期
      // secretOrPrivateKey: 'secretKey',已弃用
      signOptions: {
        // 过期时间， 可以是 number | string  number 型数据毫秒， string 型数据将转换成毫秒
        // (https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
        expiresIn: '2h',
      },
    }),
  ],
  providers: [UserService, CryptoUtil],
  controllers: [UserController, BaseController],
  exports: [UserService],
})
export class UserModule {}
