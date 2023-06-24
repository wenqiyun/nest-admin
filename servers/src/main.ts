import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { mw as requestIpMw } from 'request-ip'

import express from 'express'
import path from 'path'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

import { logger } from './common/libs/log4js/logger.middleware'
import { Logger } from './common/libs/log4js/log4j.util'
import { TransformInterceptor } from './common/libs/log4js/transform.interceptor'
import { HttpExceptionsFilter } from './common/libs/log4js/http-exceptions-filter'
import { ExceptionsFilter } from './common/libs/log4js/exceptions-filter'

import Chalk from 'chalk'

async function bootstrap() {
  // 创建 app
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  )

  const config = app.get(ConfigService)

  // 设置 api 访问前缀
  const prefix = config.get<string>('app.prefix')
  app.setGlobalPrefix(prefix)

  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  // { crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }
  app.use(helmet({ crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }))

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest-Admin App')
    .setDescription('Nest-Admin App 接口文档')
    .setVersion('2.0.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  // 项目依赖当前文档功能，最好不要改变当前地址
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Nest-Admin API Docs',
  })

  // 获取真实 ip
  app.use(requestIpMw({ attributeName: 'ip' }))

  // 全局验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true, // 开发环境
      disableErrorMessages: false,
      forbidUnknownValues: false,
    }),
  )

  // 日志
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(logger)
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor())
  // 所有异常
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalFilters(new HttpExceptionsFilter())
  // 获取配置端口
  const port = config.get<number>('app.port') || 8080
  await app.listen(port)

  const fileUploadLocationConfig = config.get<string>('app.file.location') || '../upload'
  const fileUploadBastPath = path.normalize(
    path.isAbsolute(fileUploadLocationConfig)
      ? `${fileUploadLocationConfig}`
      : path.join(process.cwd(), `${fileUploadLocationConfig}`),
  )
  Logger.log(
    Chalk.green(`Nest-Admin 服务启动成功 `),
    '\n',
    Chalk.green('上传文件存储路径'),
    `        ${fileUploadBastPath}`,
    '\n',
    Chalk.green('服务地址'),
    `                http://localhost:${port}${prefix}/`,
    '\n',
    Chalk.green('swagger 文档地址        '),
    `http://localhost:${port}${prefix}/docs/`,
  )
}

bootstrap()
