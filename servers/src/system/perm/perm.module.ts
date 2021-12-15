import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PermService } from './perm.service'
import { PermController } from './perm.controller'

@Module({
  imports: [HttpModule],
  providers: [PermService],
  controllers: [PermController],
  exports: [PermService]
})
export class PermModule {}
