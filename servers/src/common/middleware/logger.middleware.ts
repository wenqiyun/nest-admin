import { Logger } from '../utils/log.util'
import { Request, Response, NextFunction } from 'express'

export function logger(req: Request, res: Response, next: NextFunction): void {
  const statusCode = res.statusCode
  const logFormat = `>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      Request original url: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
      Status code: ${statusCode}
      Parmas: ${JSON.stringify(req.params)}
      Query: ${JSON.stringify(req.query)}
      Body: ${JSON.stringify(req.body)} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 
    `
  next()

  if (statusCode >= 500) {
    Logger.error(logFormat)
  } else if (statusCode >= 400) {
    Logger.warn(logFormat)
  } else {
    Logger.access(logFormat)
    Logger.log(logFormat)
  }
}
