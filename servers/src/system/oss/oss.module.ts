import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OssEntity } from './oss.entity'
import { OssService } from './oss.service'
import { OssController } from './oss.controller'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forFeature([OssEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        dest: config.get('uploadConfig.location'),
        limits: { fileSize: 10 * 1024 * 1024 }, // 文件大小限制 10M
      }),
    }),
  ],
  providers: [OssService],
  controllers: [OssController],
})
export class OssModule {}
