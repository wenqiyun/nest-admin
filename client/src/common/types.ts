import type { UploadFile } from 'element-plus/es/components/upload/src/upload'

export type MyUploadFile = UploadFile & {
  type: string
}
