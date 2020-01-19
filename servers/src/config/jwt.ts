import { registerAs } from '@nestjs/config'

export default registerAs('JWTConfig', () => ({
  secretKey: process.env.JWT_SECRET_KEY,
}))
