import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum'
/**
 * 获取 模块前缀与唯一标识 整合后的 redis key
 * @param moduleKeyPrefix 模块前缀
 * @param id id 或 唯一标识
 */
export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`
}

/**
 * 下划线转驼峰
 * @param str
 * @returns
 */
export function toCamelCase(str: string): string {
  return str.replace(/_(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * 驼峰命名转下划线
 * @param str
 * @returns
 */
export function toUnderline(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 对象 key 下划线转驼峰，驼峰转下划线
 * @param target 目标
 * @param targetType
 * @param cutStr 对象 key 裁剪字段
 * @returns
 */
export function objAttrToCamelOrUnderline(
  target: Record<string, any>,
  targetType: 'camelCase' | 'underline',
  cutStr?: string,
) {
  const _target = {}
  Object.keys(target).forEach((k) => {
    let _k = k
    if (!!cutStr) {
      _k = _k.replace(cutStr, '')
    }
    _k = targetType === 'camelCase' ? toCamelCase(_k) : toUnderline(_k)
    _target[_k] = target[k]
  })
  return _target
}
