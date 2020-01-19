import { createHash } from 'crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CryptoUtil {
  /**
   * 加密登录密码
   * @param password 登录密码
   */
  encryptPassword(password: string): string {
    return createHash('sha256')
      .update(password)
      .digest('hex')
  }

  /**
   * 检查登录密码是否正确
   * @param password 登录密码
   * @param encryptedPassword 库中加密后的密码
   */
  checkPassword(password: string, encryptedPassword): boolean {
    const currentPass = this.encryptPassword(password)
    return currentPass === encryptedPassword
  }
}
