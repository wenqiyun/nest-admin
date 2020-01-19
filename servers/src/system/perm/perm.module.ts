import { Module, Global } from '@nestjs/common'
import { PermService } from './perm.service'
import { PermController } from './perm.controller'

@Global()
@Module({
  imports: [],
  providers: [PermService],
  exports: [PermService],
  controllers: [PermController],
})
export class PermModule {}
