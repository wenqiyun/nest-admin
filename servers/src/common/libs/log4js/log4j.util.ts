/* eslint-disable @typescript-eslint/no-explicit-any */
import Path from 'path'
import Log4js from 'log4js'
import Util from 'util'
import dayjs from 'dayjs' // 处理时间的工具
import * as StackTrace from 'stacktrace-js'
import Chalk from 'chalk'
import config from '../../../config/index'

const appLogDirConfig = config().app.logger.dir

const baseLogPath = Path.normalize(
  Path.isAbsolute(appLogDirConfig) ? appLogDirConfig : Path.join(process.cwd(), appLogDirConfig),
)

const env = process.env.NODE_ENV
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

// 内容跟踪类
export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number,
  ) {}
}

Log4js.addLayout('Nest-Admin', (logConfig: any) => {
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
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()} - `
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY/MM/DD HH:mm:ss')}`
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

const log4jsConfigure = {
  appenders: {
    access: {
      type: 'dateFile',
      filename: `${baseLogPath}/access/access.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true,
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['app', 'errors'],
      level: 'DEBUG',
    },
    info: { appenders: ['app', 'errors'], level: 'info' },
    access: { appenders: ['app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
}

const getConfigure = () => {
  if (env === 'development') {
    log4jsConfigure.appenders['console'] = {
      type: 'console',
      layout: { type: 'Nest-Admin' },
    }
    log4jsConfigure.categories.default.appenders.unshift('console')
    log4jsConfigure.categories.info.appenders.unshift('console')
    log4jsConfigure.categories.access.appenders.unshift('console')
  }
  return log4jsConfigure
}

// 注入配置
Log4js.configure(getConfigure())

// 实例化
const logger = Log4js.getLogger()
logger.level = LoggerLevel.TRACE

export class Logger {
  static trace(...args) {
    logger.trace(Logger.getStackTrace(), ...args)
  }

  static debug(...args) {
    logger.debug(Logger.getStackTrace(), ...args)
  }

  static log(...args) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static info(...args) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static warn(...args) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static warning(...args) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static error(...args) {
    logger.error(Logger.getStackTrace(), ...args)
  }

  static fatal(...args) {
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
