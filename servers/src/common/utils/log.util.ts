import * as _ from 'lodash'
import * as Path from 'path'
import * as Log4js from 'log4js'
import * as Util from 'util'
import dayjs from 'dayjs'
import * as StackTrace from 'stacktrace-js'
import Chalk from 'chalk'
import dotenv from 'dotenv'
// 配置
dotenv.config()

const baseLogPath = Path.resolve(__dirname, process.env.SYS_LOGGER_FILE) // 日志写入目录
console.log('日志存储目录', baseLogPath)

// 日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number
  ) {}
}

Log4js.addLayout('nest-admin', (logConfig: any) => {
  return (logEvent: Log4js.LoggingEvent): string => {
    let moduleName = ''
    let position = ''

    // 日志组装
    const messageList: string[] = []
    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context
        // 显示触发日志的坐标（行，列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`
        }
        return
      }

      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true)
      }

      messageList.push(value)
    })

    // 日志组成部分
    const messageOutput: string = messageList.join(' ')
    const positionOutput: string = position ? ` [${position}]` : ''
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`
    const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] '
    let levelOutput = `[${logEvent.level}] ${messageOutput}`

    // 根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = Chalk.green(levelOutput)
        break
      case LoggerLevel.INFO:
        levelOutput = Chalk.cyan(levelOutput)
        break
      case LoggerLevel.WARN:
        levelOutput = Chalk.yellow(levelOutput)
        break
      case LoggerLevel.ERROR:
        levelOutput = Chalk.red(levelOutput)
        break
      case LoggerLevel.FATAL:
        levelOutput = Chalk.hex('#DD4C35')(levelOutput)
        break
      default:
        levelOutput = Chalk.grey(levelOutput)
        break
    }

    return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(moduleOutput)}${levelOutput}${positionOutput}`
  }
})

// 注入配置
Log4js.configure({
  appenders: {
    console: {
      type: 'console', // 打印到控制台
      layout: { type: 'Love-service' }
    },
    access: { 
      type: 'dateFile',  // 写入文件，并按日期分类
      filename: `${baseLogPath}/access/access.log`,  // 日志文件名 access.20200220.log
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60, // 日志保存天数
      numBackups: 3,
      category: 'http',
      keepFileExt: true // 是否保留文件后缀
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile'
    }

  },
  categories: {
    default: {
      appenders: ['console', 'app', 'errors'],
      level: 'debug'
    },
    info: { appenders: ['console', 'app', 'errors'], level: 'info' },
    access: { appenders: ['console', 'app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' }
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID' // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
})

// 实例化
const logger = Log4js.getLogger()
logger.level = LoggerLevel.TRACE

export class Logger {
  
  static trace(...args): void {
    logger.trace(Logger.getStackTrace(), ...args)
  }

  static debug(...args): void {
    logger.debug(Logger.getStackTrace(), ...args)
  }

  static log(...args): void {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static info(...args): void {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static warn(...args): void {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static warning(...args): void {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static error(...args): void {
    logger.error(Logger.getStackTrace(), ...args)
  }

  static fatal(...args): void {
    logger.fatal(Logger.getStackTrace(), ...args)
  }

  static access(...args) {
    const loggerCustom = Log4js.getLogger('http')
    loggerCustom.info(Logger.getStackTrace(), ...args)
  }

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  static getStackTrace(deep = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync()
    const stackInfo: StackTrace.StackFrame = stackList[deep]

    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = Path.basename(fileName)
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}
