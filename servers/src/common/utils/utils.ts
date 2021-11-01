import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum'
/**
 * 获取 模块前缀与唯一标识 整合后的 redis key
 * @param moduleKeyPrefix 模块前缀
 * @param id id 或 唯一标识
 */
export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`
}

export function formatSecond (time: string): number {
  if (time.indexOf('h')) return Number(time.replace('h', '')) * 60 * 60
  else if (time.indexOf('d')) return Number(time.replace('d', '')) * 60 * 60 * 24
  else if (/^(0|[1-9][0-9]*)$/.test(time)) return Number(time)
  return 0
}

