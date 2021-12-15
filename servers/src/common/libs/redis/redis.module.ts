import { DynamicModule, Global, Module } from '@nestjs/common'
import { RedisModule, RedisModuleAsyncOptions, RedisModuleOptions } from 'nestjs-redis'
import { RedisUtilService } from './redis.service'

/**
 * redis module
 *
 * 当前模块是对 nest-redis 的一个简单封装
 */
@Global()
@Module({
  providers: [RedisUtilService],
  exports: [RedisUtilService],
})
export class RedisUtilModule {
  static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule {
    return {
      module: RedisUtilModule,
      imports: [RedisModule.register(options)],
      providers: [RedisUtilService],
      exports: [RedisUtilService],
    }
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisUtilModule,
      imports: [RedisModule.forRootAsync(options)],
      providers: [RedisUtilService],
      exports: [RedisUtilService],
    }
  }
}
