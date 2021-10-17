import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MenuPermEntity } from './menu-perm.entity'
import { MenuEntity } from './menu.entity'
import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, MenuPermEntity])],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
