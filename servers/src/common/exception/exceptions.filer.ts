import { ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Logger } from '../utils/log.util'

export class ExceptionsFilter implements ExceptionFilter {
  async catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    Logger.error('exception', JSON.stringify(exception))

    let message = exception.message
    let isDeepestMessage = false
    while (!isDeepestMessage) {
      isDeepestMessage = !message.message
      message = isDeepestMessage ? message : message.message
    }

    const errorResponse = {
      message: message || '网络开小差',
      statusCode: 500
    }

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    Logger.error(
      `Catch http exception at ${request.method} ${request.url} ${status}`
    )

    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
