import { registerAs } from '@nestjs/config'

export default registerAs('uploadConfig', () => ({
  location: process.env.UPLOAD_LOCATION,
  www: process.env.SYSTEM_WWW,
}))
