import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserRoleEntity } from '../user/user-role.entity'

import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { RoleEntity } from './role.entity'
import { RoleMenuEntity } from './role-menu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RoleMenuEntity, UserRoleEntity])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
