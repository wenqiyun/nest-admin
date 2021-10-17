## nestjs 框架

 Nest 从请求的纬度上讲将应用代码逻辑氛围三种 控制器（Controller）, 提供者 （Provider）, 中间件 （Middleware）。而从功能纬度上讲，将应用分割为若干模块（Module）, 并通过 exports 等方式向其他模块提供自己的内部服务。

#### 先从控制器这个概念入手

控制器概念这个太常见了， NestNest 中也大同小异，而且 Nest 中的做法和 SpringMVC 中做法几乎一样


```
@Controller('user')
export class UserController {}
```

我们通过 ```@Controller``` 装饰类， 并通过以下方式

```
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'

@Module({
    controllers: [UserController]
})
export class AppModule {}
```

注册到 App 模块中，那么应用中就有一个 User 控制器，现在我们可以为控制器编写业务代码：

```
import { Controller, Get, Req, Query, Headers, Param, Post } from '@nestjs/common'

@Controller('user')
export class UserController {

    @Get('')
    findAll(@Req req, @Query query, @Headers() headers) {
        return [query, headers]
    }

    @Get(':id')
    findOne(@Param() params) {
        return params
    }

}
```

控制器端点的设计也基本上照搬了 SpringMVC 的设计，同样利用 ```@Get``` 、``` @Post ```、 ```@Put```、 ```@Delete``` 等 代表当前方法对应什么请求方法和请求路径。而且还可以通过参数装饰器装饰各种参数，例如 用```@Req``` 装饰 req , 用 ```@Query``` 装饰 query （查询参数）等，这样的好处显而易见，参数可以随意排列，不必担心传错参数。

不过 Nest 不仅仅利用了装饰器，其实它底层是基于 Express 的，我们也可以利用 Express 结合上述模式来满足我们的要求。例如 上述代码我们其实是很难更改 http status ， 我们可以利用 Express 的 res 参数修改：

```
import { Body, Controller, Get, Req, Query, Headers, Param, Post, Put, Res, HttpStatus } from '@nestjs/common'

@Controller('user')
export class UserController {

    @Get('')
    findAll(@Req req, @Query query, @Headers() headers) {
        return [query, headers]
    }

    @Get(':id')
    findOne(@Param() params) {
        return params
    }


    @Put()
    update(@Body() updateUserDto: UpdateUserDto, @Res() res) {
        res.status(HttpStatus.UNAUTHORIZED).send()
    }

}
```

#### Provider 是个大概念

Service 、 Repository 、Factory 都可以被认为是 Provider 。 所有 Provider 都是可注入的组件， 以 Service 为例

```
import { Injectable } from '@nestjs/common'
import User from './interfaces/user'
import UpdateUserDto from './dto/update-user.dto'

@Injectable()
export class UserService {
    private readonly users: User[] => []

    create (user: User): void {
        this.users.push(user)
    }

    findAll (): User[] {
        return users
    }

    update (index: number, userInfo: UpdateUserDto): User {
        this.users[index] = userInfo
        return this.users[index]
    }
}
```

我们通过 ```@Injectable``` 将其标记为 Provider, 现在你可以将 UserService 注入到任意的 Controller ， 任意 Service 中，以之前的 UserController 为例：

```
import { Body, Controller, Get, Req, Query, Headers, Param, Post, Put, Res, HttpStatus } from '@nestjs/common'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    findAll(@Req req, @Query query, @Headers() headers) {
        return [query, headers]
    }

    @Get(':id')
    findOne(@Param() params) {
        return params
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
       this.userService.create(dto)
    }

    @Put()
    update(@Body() updateUserDto: UpdateUserDto, @Res() res) {
        res.status(HttpStatus.UNAUTHORIZED).send()
    }

}
```

我们通过 Controller 的方式为控制器注入了 UserService 。 说明 Nest 是一个拥有控制反转能力的框架。

#### Nest 将 Express 中的 Middleware 细化了

除了可以添加 Middleware , Nest 还可以添加 Filter（过滤器）、 Pipe （管道）、Guard（守卫）、Interceptor（拦截器），很明显这些概念均出现在请求处理之前及请求响应之后，那么它们在 Nest 中分别有什么用？ 基于什么目的，Nest 要造这么多概念？

Middleware 的用法 Nest 做了一层封装，但是很明显根本方法没有变化，都是一个 MiddlewareFunction ：

```
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('log', true)

    resolve(...args: any[]): MiddlewareFunction {
        this.logger.log('Request...')
        next()
    }
}
```

你还可以和 Express 一样，只使用一个函数

```
export function LoggerMiddleware (req, res, next) {}
```

其使用也很简单

```
export class AppModule implements NextModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogerMiddleware).forRoutes('user')
  }
}
```

利用 MiddlewareConsumer 来应用中间件，其中 apply 中可以添加一个或多个中间件，而 forRoutes 方法则指定哪些路由可以应用该中间件。 forRoutes 使用也很灵活，可以使用通配符，也可以指定控制器，甚至可以指定请求方法。

```
forRoutes('*') // 匹配所有路径
forRoutes('user(12)?') // 匹配 user 和 user12
forRoutes(UserController) // 匹配指定控制器
forRoutes({ path: 'user',method: RequestMethod.GET }) // 匹配请求方法
```

Nest 中的 Filer 用于异常捕捉，和 Java Web 中的 Servle 区别很大。在 Nest 中，我们通过 HttpException 抛出错误，其返回的结果通常是

```
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "未授权"
}
```

但是我们可能会想要定制自己的错误返回信息，Nest 中的 Filter 为此而生：

```
import { ExceptionFilter, Catch, HttpException, ArgumentsHost } from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = ctx.getStatus()

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url
      })
  }
}
```
这里我们定制了错误返回信息，下面我们只需绑定该 ExceptionFilter 即可，绑定的方式和层级有很多种，我们使 ``` @UseFilers ``` 即可绑定在控制器方法上

```
@Post()
@UseFilers(new HttpExceptionFilter())
async create (@Body() dto: CreateUserDto) {
  throw new ForbiddenException()
}
```

也可以绑定到模块上

```
@Module({
  imports: [AuthModule,UserModule],
  providers: [
    {
      provide: API_FILER,
      useClass: HttpExceptionFilter
    }
  ]
})
```

甚至可以绑定在全局

```
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(3000)
}
bootstrap()
```
现在返回的信息就变成这样了，

```
{
  "statusCode": 401,
  "timestamp": "2021-01-09T15:37:22.144Z",
  "path": '/users'
}
```

另外你也注意到了，我们在 ``` @Catch ``` 中传入了参数 ``` HttpException  ```，这限定了我们 catch 的范围， 其实也可以不传任何异常参数，让 Filter 捕捉任何异常。

Pipe 在 Nest 则常用于验证传输数据，转换传输类型，在 Pipe 中你可以使用 Schema 验证，也可以使用 class 验证。 Schema 验证可以使用 Joi 库，我更喜欢 class 验证。

class 验证主要使用了 ``` class-validator ``` 和 ``` class-transformer ``` 两个库，主要思想是将传输数据转换成 DtoClass 对象， 然后根据该 DtoClass 的 meta 信息进行验证。其在 Nest 内部有集成。使用如下
上述代码其实在 Nest 内部有集成，所以我们不用做不必要的集成， 我们接着看 Pipe 的使用，和 Filter 一样也有多种方式和层级。

```
// 在参数中
@Post()
async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
 this.catsService.create(createCatDto)
}

// 在方法中
@Post()
@UsePipes(new ValidationPipe())
async create(@Body() createCatDto: CreateCatDto) {
 this.catsService.create(createCatDto)
}

// 在模块中
import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'

@Module({
 providers: [
   {
     provide: APP_PIPE,
     useClass: CustomGlobalPipe,
   },
 ],
})
export class ApplicationModule {}

// 在全局应用中
async function bootstrap() {
 const app = await NestFactory.create(ApplicationModule)
 app.useGlobalPipes(new ValidationPipe())
 await app.listen(3000)
}
bootstrap()
```

Guard 守卫，主要用于权限控制，与 Middleware 相似，不同之处在与可以获取到当前正在访问的 Controller 或其中的方法。个人认为作者之所以这样设计就是为了从相关处理逻辑中获取元信息，从而实现基于装饰器的权限控制。

```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class RolesGuard implements CanActivate {
 canActivate(
   context: ExecutionContext,
 ): boolean | Promise<boolean> | Observable<boolean> {
   return true
 }
}
```
应用该 Guard

```
// 在Controller中
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}


// 在模块中应用
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

@Module({
 providers: [
   {
     provide: APP_GUARD,
     useClass: RolesGuard,
   },
 ],
})
export class ApplicationModule {}
// 在全局应用中
const app = await NestFactory.create(ApplicationModule)
app.useGlobalGuards(new RolesGuard())
```

那么如果仅仅是这样，岂不是 Middleware 也可以实现，何必要新起一个概念？

关键在于 ```ExecutionContext``` ，这个对象代表请求的上下文，你可以通过这个对象获取执行方法，执行的类等，非常强大，所以基于此我们可以做些权限认证

```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
 constructor(private readonly reflector: Reflector) {}

 canActivate(context: ExecutionContext): boolean {
   const roles = this.reflector.get<string[]>('roles', context.getHandler())
   if (!roles) {
     return true
   }
   const request = context.switchToHttp().getRequest()
   const user = request.user
   const hasRole = () => user.roles.some((role) => roles.includes(role))
   return user && user.roles && hasRole()
 }
}
```
请求的 user 信息，我们可以通过中间件从数据库或者从配置文件中获取。

Nest 的 Interceptor （拦截器），可以在请求处理逻辑前后添加处理逻辑，相比较Guard，Interceptor同样能获取到上下文，而且利用RxJS（没学过，这个也是我学习Nest的难点，也许学Angular的同学会觉得简单点）可以对响应体做很多处理。目前的已知的用法就有：1. 响应体的数据映射 2. 执行额外操作 3. 异常处理 4. 重写流。这些操作都完全借助RxJS的能力。下面演示一个执行额外操作的例子，主要借助了tap操作符：

```
import { NestInterceptor, Injectable, Logger, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
 private readonly logger = new Logger('LoggingInterceptor')
 intercept(
   context: ExecutionContext,
   call$: Observable<any>,
 ): Observable<any> {
   this.logger.log('Before...')
   const now = Date.now()
   return call$.pipe(
     tap(() => this.logger.log(`After...${Date.now() - now}ms`)),
   )
 }
}
```
我们的使用拦截器的方法也和上述概念类似，有使用 @UseInteceptors ，也有使用 useGlobalInterceptors 方法的，也有在模块中使用的。
