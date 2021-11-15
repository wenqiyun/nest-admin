import { Injectable } from "@nestjs/common"
import { ConfigService } from '@nestjs/config'
import { JwtService } from "@nestjs/jwt"

import { CreateTokenDto } from "./dto/create-token.dto"

@Injectable()
export class JwtUtilService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 生成 token 与 刷新 token
   * @param payload
   * @returns
   */
  genToken (payload: { id: string }): CreateTokenDto {
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.config.get('jwt.refreshExpiresIn') })
    return { accessToken, refreshToken }
  }

  /**
   * 生成刷新 token
   */
  refreshToken(id: string): string {
    return this.jwtService.sign({ id })
  }

  /** 校验 token */
  verifyToken(token: string): string {
    try {
      if (!token) return null
      const id = this.jwtService.verify(token.replace('Bearer ', ''))
      return id
    } catch (error) {
      return null
    }
  }

}
