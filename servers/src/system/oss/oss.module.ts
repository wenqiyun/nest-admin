import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { OssController } from './oss.controller'
import { OssService } from "./oss.service"
import { OssEntity } from './oss.entity'

@Module({
  imports: [TypeOrmModule.forFeature([OssEntity])],
  providers: [OssService],
  controllers: [OssController]
})

export class OssModule {}
