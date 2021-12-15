/**
 * 各个模块功能的 redis 前缀，后一般 + id
 * 规范 最好使用 module:subModule:id 的形式
 */
export enum RedisKeyPrefix {
  USER_INFO = 'user:info:',
  USER_ROLE = 'user:role:',
  USER_MENU = 'user:menu:',
  USER_PERM = 'user:perm:',
}
