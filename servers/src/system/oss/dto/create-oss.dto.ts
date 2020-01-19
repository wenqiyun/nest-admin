/** 内部创建，接口只需上传接收文件 */
export class CreateOssDto {
  constructor(url, mimetype, path, size, oldName) {
    this.url = url
    this.type = mimetype
    this.location = path
    this.size = size
    this.oldName = oldName
  }
  oldName: string
  url: string
  size: number
  type: string
  location: string
}
