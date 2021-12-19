import { UploadFile } from 'element-plus/es/components/upload/src/upload.type'

export type MyUploadFile = UploadFile & {
  type: string
}
