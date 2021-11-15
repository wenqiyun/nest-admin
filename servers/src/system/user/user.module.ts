import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'

import { BaseController } from './base.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRoleEntity } from './user-role.entity'
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [BaseController, UserController],
  exports: [UserService],
})
export class UserModule {}
