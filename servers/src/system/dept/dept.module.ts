import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DeptEntity } from "./dept.entity"

import { DeptService } from './dept.service'
import { DeptController } from './dept.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([DeptEntity]),
  ],
  providers: [DeptService],
  controllers: [DeptController],
  exports: [],
})
export class DeptModule {}
