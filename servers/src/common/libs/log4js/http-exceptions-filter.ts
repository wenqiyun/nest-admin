import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Logger } from './log4j.util';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()

    const logFormat = `-----------------------------------------------------------------------
        Request original url: ${request.originalUrl}
        Method: ${request.method}
        IP: ${request.ip}
        Status code: ${status}
        Response: ${exception.toString()}
        -----------------------------------------------------------------------
        `
    Logger.info(logFormat)
    response.status(status).json({
      statusCode: status,
      error: exception.message,
      msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`
    })
  }

}
