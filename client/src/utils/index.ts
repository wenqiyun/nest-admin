import dayjs from 'dayjs'
import { ElLoading } from 'element-plus'

export function jsonTimeFormat (jsonTime: string, format?: string): string {
  return dayjs(jsonTime).format(format || 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 扁平数组转 树结构
 * @param source
 * @param param
 */
export function arrToTree (source: any[], { root = 0, pidKey = 'pid', idKey = 'id', childKey = 'children' }) {
  function getNode (id: string | number) {
    const node = []
    for (let i = 0, len = source.length; i < len; i++) {
      if (source[i][pidKey] === id) {
        const children = getNode(source[i][idKey])
        if (children.length > 0) source[i][childKey] = children
        node.push(source[i])
      }
    }
    return node
  }
  return getNode(root)
}

export function showLoading () {
  return ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
