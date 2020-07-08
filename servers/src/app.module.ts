import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { RedisModule, RedisModuleOptions } from 'nestjs-redis'
import { ConfigModule, ConfigService } from '@nestjs/config'

import appConfig from './config/index'

import { UserModule } from './system/user/user.module'
import { DeptModule } from './system/dept/dept.module'
import { MenuModule } from './system/menu/menu.module'
import { RoleModule } from './system/roles/role.module'
import { PermModule } from './system/perm/perm.module'
import { OssModule } from './system/oss/oss.module'

// import { ServeStaticModule } from '@nestjs/serve-static'
// import { join } from 'path'

@Module({
  imports: [
    // 静态服务，可用于文件服务，生产环境最好使用 nginx 做静态服务
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../', 'upload'),
    // }),
    // 配置模块
    ConfigModule.forRoot({
      load: appConfig,
      isGlobal: true
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService]
    }),
    // redis
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get<RedisModuleOptions>('redis'),
      inject: [ConfigService]
    }),
    UserModule,
    DeptModule,
    MenuModule,
    RoleModule,
    PermModule,
    OssModule
  ]
})
export class ApplicationModule {}
