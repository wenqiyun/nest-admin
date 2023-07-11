import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Logger } from './log4j.util'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const req = context.getArgByIndex(1).req
    return next.handle().pipe(
      map((data) => {
        const logFormat = `
##############################################################################################################
Request original url: ${req.originalUrl}
Method: ${req.method}
IP: ${req.ip}
User: ${JSON.stringify(req.user)}
Response data: ${JSON.stringify(data.data)}
##############################################################################################################
`
        Logger.info(logFormat)
        Logger.access(logFormat)
        return data
      }),
    )
  }
}
