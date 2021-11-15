import { Global, Module } from "@nestjs/common"
import { JwtModule } from '@nestjs/jwt'
import { ConfigService, ConfigModule } from '@nestjs/config'

import { JwtUtilService } from "./jwt.service"

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secretkey'),
        signOptions: {
          expiresIn: config.get('jwt.expiresin'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtUtilService],
  exports: [JwtUtilService]
})

export class JwtUtilModule {}
