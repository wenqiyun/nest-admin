import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserRoleEntity } from '../user/role/user-role.entity'
import { PermModule } from '../perm/perm.module'

import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { RoleEntity } from './role.entity'
import { RoleMenuEntity } from './role-menu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RoleMenuEntity, UserRoleEntity]), PermModule],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
