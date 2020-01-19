import { Module } from '@nestjs/common'
import { DeptService } from './dept.service'
import { DeptController } from './dept.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeptEntity } from './dept.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DeptEntity])],
  providers: [DeptService],
  controllers: [DeptController],
})
export class DeptModule {}
