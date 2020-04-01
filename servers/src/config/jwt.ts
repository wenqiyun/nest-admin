import { registerAs } from '@nestjs/config'

export default registerAs('JWT', () => ({
  secretKey: process.env.JWT_SECRET_KEY || 'baishitong_kapok',
  expiresIn: process.env.JWT_EXPIRESIN || '24h'
}))
