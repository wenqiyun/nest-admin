import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
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
      isGlobal: true,
    }),
    // 系统日志模块
    WinstonModule.forRoot({
      // evel: 'info',
      // format: winston.format.json(),
      // defaultMeta: { service: 'kapok-service' },
      // transports: [
      //   //
      //   // - Write all logs with level `error` and below to `error.log`
      //   // - Write all logs with level `info` and below to `combined.log`
      //   //
      //   // new winston.transports.File({ filename: 'error.log', level: 'error' }),
      //   // new winston.transports.File({ filename: 'combined.log' }),
      // ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: config.get('database.type'),
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        charset: config.get('database.charset'),
        multipleStatements: config.get('datebase.multipleStatements'),
        // dateStrings: config.get('database.dateStrings'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: config.get('database.synchronize'),
        logging: config.get('database.logging'),
        logger: config.get('database.logger'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    DeptModule,
    MenuModule,
    RoleModule,
    PermModule,
    OssModule,
  ],
})
export class ApplicationModule {}
