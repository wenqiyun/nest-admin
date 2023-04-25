import { promiseTimeout } from '@vueuse/core'

/**
 * useApiLock
 * 主要用于等异步函数返回
 * minInterval: number 单位 ms
 * 如果 异步函数返回所用时长少于配置的时长，则等待 使总时长达到 配置的时长；大于或等于则不处理
 * 适合使用场景： 比如 页面 设计了 骨架屏，加载ing 等，接口响应太快会直接闪一下，这时候我们设置一个等待时长
 */
export function useApiLock<V = any>(fn: () => Promise<V>, minInterval?: number) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<V>(async (resolve) => {
    const startTime = Date.now()
    const res = await fn().catch((r) => resolve(r))
    const endTime = Date.now()
    if (minInterval && endTime - startTime < minInterval) {
      await promiseTimeout(minInterval - (endTime - startTime))
    }
    resolve(res as V)
  })
}
