import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'
// import * as csurf from 'csurf'

import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston'
import { Logger, ValidationPipe } from '@nestjs/common'

const port = process.env.PORT || 8080

async function bootstrap() {
  // Logger.log('--------- 服务启动 -------------')
  // 设置 cors 允许跨域访问
  const app = await NestFactory.create(ApplicationModule, {
    cors: true,
    logger: WinstonModule.createLogger({}),
  })
  // 全局日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // 设置角色验证器
  // 访问频率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  )

  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api')

  // 接口文档 swagger 参数
  const options = new DocumentBuilder()
    .setTitle('Kapok 工作流 app')
    .setDescription('Kapok API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  // 设置 swagger 网址
  SwaggerModule.setup('docs', app, document)

  // 防止跨站请求伪造
  // 设置 csrf 保存 csrfToken
  // app.use(csurf())

  // web 漏洞
  app.use(helmet())
  // 自动验证（以后等系统完善后可自定义）
  // 注册并配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
    }),
  )

  // 启动程序，监听端口
  await app.listen(port)

  Logger.log(`http://localhost:${port}`, '服务启动成功')
}

bootstrap()
