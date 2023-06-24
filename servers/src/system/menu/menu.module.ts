import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PermModule } from '../perm/perm.module'

import { MenuPermEntity } from './menu-perm.entity'
import { MenuEntity } from './menu.entity'
import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, MenuPermEntity]), PermModule],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
