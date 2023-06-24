import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'

/** 将全局 CSS 变量导入 JS 中使用 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ''
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/**
 * 处理下载流
 * @param { content } 流
 * @param { fileName } 文件名
 */
export const downLoad = (content: any, fileName: string) => {
  const blob = new Blob([content]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
  const url = window.URL.createObjectURL(blob) // URL.createObjectURL(object)表示生成一个File对象或Blob对象
  const dom = document.createElement('a') // 设置一个隐藏的a标签，href为输出流，设置download
  dom.style.display = 'none'
  dom.href = url
  dom.setAttribute('download', fileName) // 指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
  document.body.appendChild(dom)
  dom.click()
}

export const dateStrFormat = (dateStr: string, format?: string) => {
  try {
    return dayjs(dateStr).format(format || 'YYYY-MM-DD HH:mm:ss')
  } catch (error) {
    console.error(error)
  }
}

export interface ListToTreeOptions {
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
export function listToTree(
  source: any[],
  { root = 0, pidKey = 'pid', idKey = 'id', childKey = 'children' }: ListToTreeOptions
) {
  function getNode(id: string | number) {
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
 * 字节 转换成 正常单位
 */
export function tranFileSize(fileSize: number) {
  // 把字节转换成正常文件大小
  if (!fileSize) return ''
  const num = 1024.0 // byte
  if (fileSize < num) return fileSize + 'B'
  if (fileSize < Math.pow(num, 2)) return (fileSize / num).toFixed(2) + 'KB' // kb
  if (fileSize < Math.pow(num, 3)) return (fileSize / Math.pow(num, 2)).toFixed(2) + 'MB' // M
  if (fileSize < Math.pow(num, 4)) return (fileSize / Math.pow(num, 3)).toFixed(2) + 'G' // G
  return (fileSize / Math.pow(num, 4)).toFixed(2) + 'T' // T
}

/**
 * 用户删除等 二次确认消息弹窗
 * @param msg 消息
 * @param fn
 */
export async function confirmElBox(msg: string, fn: () => void) {
  try {
    await ElMessageBox.confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await fn?.()
  } catch (error) {}
}
