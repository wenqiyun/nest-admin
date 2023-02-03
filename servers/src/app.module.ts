import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisClientOptions } from '@liaoliaots/nestjs-redis'
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static'
import { APP_GUARD } from '@nestjs/core'
import path from 'path'

import configuration from './config/index'

import { RedisModule } from './common/libs/redis/redis.module'
import { JwtAuthGuard } from './common/guards/auth.guard'
import { RolesGuard } from './common/guards/roles.guard'

import { UserModule } from './system/user/user.module'
import { AuthModule } from './system/auth/auth.module'
import { MenuModule } from './system/menu/menu.module'
import { RoleModule } from './system/role/role.module'
import { PermModule } from './system/perm/perm.module'
import { OssModule } from './system/oss/oss.module'
import { DeptModule } from './system/dept/dept.module'
import { PostModule } from './system/post/post.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    // 服务静态化, 生产环境最好使用 nginx 做资源映射， 可以根据环境配置做区分
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        rootPath: path.join(__dirname, '../../', 'upload'),
        exclude: [`${config.get('app.prefix')}`],
        serveRoot: config.get('app.file.serveRoot'),
        serveStaticOptions: {
          cacheControl: true
        }
      }] as ServeStaticModuleOptions[]
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          // 可能不再支持这种方式，entities 将改成接收 实体类的引用
          //
          // entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          autoLoadEntities: true,
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
          // cache: {
          //   type: 'ioredis',
          //   ...config.get('redis'),
          //   alwaysEnabled: true,
          //   duration: 3 * 1000, // 缓存3s
          // },
        } as TypeOrmModuleOptions
      },
    }),
    // libs redis
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          return {
            closeClient: true,
            config: config.get<RedisClientOptions>('redis')
          }
        }
      },
      true
    ),
    // 系统基础模块
    UserModule,
    AuthModule,
    MenuModule,
    RoleModule,
    PermModule,
    DeptModule,
    PostModule,
    OssModule
    // 业务功能模块
  ],
  // app module 守卫，两个守卫分别依赖 UserService、PermService, 而 UserService、PermService 没有设置全局模块，
  // 所以这俩 守卫 不能再 main.ts 设置全局守卫
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AppModule {}
