import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthModule } from '../auth/auth.module'

import { UserEntity } from './user.entity'
import { UserRoleEntity } from './user-role.entity'

import { UserRoleService } from './user-role.service'
import { UserService } from './user.service'

import { BaseController } from './base.controller'
import { UserController } from './user.controller'
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    forwardRef(() => AuthModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secretkey'),
        signOptions: {
          expiresIn: config.get('jwt.expiresin'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, UserRoleService],
  controllers: [BaseController, UserController],
  exports: [UserService],
})
export class UserModule {}
