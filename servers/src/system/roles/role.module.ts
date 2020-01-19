import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { RoleEntity } from './role.entity'
import { RoleMenuEntity } from '../relationalEntities/roleMenu/roleMenu.entity'
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RoleMenuEntity, UserRoleEntity])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
