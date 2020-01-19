import { HttpException, HttpStatus } from '@nestjs/common'

export class ForbiddenException extends HttpException {
  constructor() {
    super('无权限', HttpStatus.FORBIDDEN)
  }
}
