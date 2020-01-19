import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { MenuEntity } from './menu.entity'
import { RoleMenuEntity } from '../relationalEntities/roleMenu/roleMenu.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, RoleMenuEntity])],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
