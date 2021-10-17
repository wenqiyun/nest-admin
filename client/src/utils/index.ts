import dayjs from 'dayjs'

export function jsonTimeFormat (jsonTime: string): string {
  return dayjs(jsonTime).format('YYYY-MM-DD HH:mm:ss')
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
