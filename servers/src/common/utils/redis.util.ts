import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'
import * as Redis from 'ioredis'

@Injectable()
export class RedisUtil {
  private client: Redis.Redis
  constructor(private redisService: RedisService) {
    this.initClient()
  }

  async initClient (): Promise<void> {
    this.client = await this.redisService.getClient()
  }

  // -----------------  string 相关 --------------- //
  /**
   * 
   * @param key 存储的 key
   * @param val 对应 key 的 value
   * @param seconds 可选值， 过期时间 单位：秒
   */
  async set(key: string, val: string,  seconds?: number): Promise<void> {
    if (!seconds) {
      await this.client.set(key, val)
    } else {
      await this.client.set(key, val, 'EX', seconds)
    }
  }

  /**
   * 返回 key 对应的 value
   * @param key 
   */
  async get(key: string): Promise<string> {
    if (!key || key === '*') return
    return await this.client.get(key)
  }

  /**
   * 函数返回删除 key 的个数
   * @param keys key del(key1, key2, key3...)  
   */
  async del(keys: string | string[]): Promise<number> {
    if (!keys) return 0
    return await this.client.del(...keys)
  }

  /**
   * 返回 当前key value 过期时间 单位: 秒
   * @param key
   */
  async ttl(key: string): Promise<number> {
    if (!key) return -1
    return await this.client.ttl(key)
  }

  //  ------------------ hash ----------------------------------- //

  /**
   * hash 设置 key 下单个 field value 
   * @param key 
   * @param field 属性
   * @param value 值
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    if (!key || !field) return 0
    return await this.client.hset(key, field, value)
  }

  /**
   * hash 设置 key 下多个 field value 
   * @param key 
   * @param data 
   */
  async hmset(key: string, data: any): Promise<number | any> {
    if (!key || !data) return 0
    return await this.client.hmset(key, data)
  }

  /**
   * hash 获取单个 field 的 value
   * @param key 
   * @param field 
   */
  async hget(key: string, field: string): Promise<number | string | null> {
    if (!key || !field) return 0
    return await this.client.hget(key, field)
  }

  /**
   * hash 获取 key 下所有field 的 value 
   * @param key 
   */
  async hvals(key: string): Promise<string[]> {
    if (!key) return []
    return await this.client.hvals(key)
  }

  /**
   * hash 删除 key 下 一个或多个 fields value
   * @param key 
   * @param fields 
   */
  async hdel(key: string, fields: string | string[]): Promise<string[] | number> {
    if (!key || fields.length === 0) return 0
    return await this.client.hdel(key, ...fields)
  }

  /**
   * hash 删除 key 下所有 fields value
   * @param key 
   */
  async hdelAll(key: string): Promise<string[] | number>  {
    if (!key) return 0
    const fields = await this.client.hkeys(key)
    if (fields.length === 0) return 0
    return await this.hdel(key, fields)
  }

}
