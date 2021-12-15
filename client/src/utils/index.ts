import dayjs from 'dayjs'

export function jsonTimeFormat (jsonTime: string, format?: string): string {
  return dayjs(jsonTime).format(format || 'YYYY-MM-DD HH:mm:ss')
}

export interface ArrrToTreeOptions {
  root?: string | number
  pidKey?: string
  idKey?: string
  childKey?: string
}

/**
 * 扁平数组转 树结构
 * @param source
 * @param param
 */
export function arrToTree (source: any[], { root = 0, pidKey = 'pid', idKey = 'id', childKey = 'children' }: ArrrToTreeOptions) {
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

/**
 * 处理下载流
 * @param { content } 流
 * @param { fileName } 文件名
 */
export function downLoad (content: any, fileName: string) {
  const blob = new Blob([content]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
  const url = window.URL.createObjectURL(blob)// URL.createObjectURL(object)表示生成一个File对象或Blob对象
  const dom = document.createElement('a')// 设置一个隐藏的a标签，href为输出流，设置download
  dom.style.display = 'none'
  dom.href = url
  dom.setAttribute('download', fileName)// 指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
  document.body.appendChild(dom)
  dom.click()
}

/**
 * 文件大小 字节 显示 GB MB
 * @param fileSize
 */
export function tranFileSize (fileSize: number): string {
  let result = ''
  if (fileSize >= 1073741824) {
  // B => GB
    result = fileSize % 1073741824 === 0 ? fileSize / 1073741824 + 'G' : Math.trunc(fileSize / 1073741824) + 'G'
  } else if (fileSize >= 1048576) {
  // B => MB
    result = fileSize % 1048576 === 0 ? fileSize / 1048576 + 'MB' : Math.trunc(fileSize / 1048576) + 'MB'
  } else if (fileSize >= 1024) {
  // B => KB
    result = fileSize % 1024 === 0 ? fileSize / 1024 + 'KB' : Math.trunc(fileSize / 1024) + 'KB'
  } else {
    result = fileSize + 'B'
  }
  return result
}

/**
 * 将 el-icond的组件名 AbbCdd 转化为 i-abb-cdd 形式
 */
export function tranElIconName (iconName: string) {
  return `i${iconName.replace(/[A-Z]/g, match => ('-' + match.toLowerCase))}`
}
