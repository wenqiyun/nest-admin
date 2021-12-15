关于 ```JWT``` 的文章网上有很多这里不作阐述，简单说明下实现方式。

依赖
```
npm i passport passport-jwt @nestjs/passport @nestjs/jwt"
```

创建 auth 文件夹，代码实现如下：


auth.service.ts

```javascript

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async validateUser(payload: { id: string }): Promise<UserEntity> {
    return await this.userService.findOneById(payload.id) // 这是 user 模块，根据用户 id 查出当前用户信息
  }
}
```


auth.strategy.ts


```javascript
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  /**
   * 这里的构造函数向父类传递了授权时必要的参数，在实例化时，父类会得知授权时，客户端的请求必须使用 Authorization 作为请求头，
   * 而这个请求头的内容前缀也必须为 Bearer，在解码授权令牌时，使用秘钥 secretOrKey: 'secretKey' 来将授权令牌解码为创建令牌时的 payload。
   */
  constructor(private readonly authService: AuthService, private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secretkey'), // 配置中拿去
    })
  }

  /**
   * validate 方法实现了父类的抽象方法，在解密授权令牌成功后，即本次请求的授权令牌是没有过期的，
   * 此时会将解密后的 payload 作为参数传递给 validate 方法，这个方法需要做具体的授权逻辑，比如这里我使用了通过用户名查找用户是否存在。
   * 当用户不存在时，说明令牌有误，可能是被伪造了，此时需抛出 UnauthorizedException 未授权异常。
   * 当用户存在时，会将 user 对象添加到 req 中，在之后的 req 对象中，可以使用 req.user 获取当前登录用户。
   */
  async validate(payload: { id: string }) {
    const user = await this.authService.validateUser(payload)
    // 如果用用户信息，代表 token 没有过期，没有则 token 已失效
    if (!user) throw new UnauthorizedException()
    return user
  }
}
```

auth.module.ts

```javascript
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule), // 模块间循环依赖处理
  ],
  providers: [AuthService, AuthStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
```

将 ```AuthModule``` 绑定到 ```AppModule``` 上后，我们可以在 ```controller``` 上使用守卫装饰器 ```@UseGuards(AuthGuard)``` 验证是否生效， demo 如下

```javascript
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '查询用户列表' })
  async findList (@Query() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto)
  }
}
```

生效是生效了，但是这种方式有一个不方便的点是随着项目的开发，功能越来越多，我们需要在每个 ```controller``` 都需要写上 ```@UseGuards(AuthGuard)``` 太不方便了，这时候我们可以使用全局守卫

```javascript
// app.module.ts

@Module({
  ...

   providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
}
```

问题又来了，当我们使用全局守卫时，所有接口请求头都必须带上 ```token``` ，而实际情况项目有的接口是不需要 ```token``` 的，如 登录、注册等

那我们必须提供一种机制来将接口路由不校验 ```token```


编写装饰器

```javascript
import { SetMetadata } from '@nestjs/common'

export const ALLOW_ANON = 'allowAnon'
/**
 * 允许 接口 不校验 token
 */
export const AllowAnon = () => SetMetadata(ALLOW_ANON, true)

```


重写 ```token``` 校验

```javascript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService)
    private readonly userService: UserService
  ) {
    super()
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 函数，类 是否允许 无 token 访问
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [ctx.getHandler(), ctx.getClass()])
    if (allowAnon) return true
    const req = ctx.switchToHttp().getRequest()
    // const res = ctx.switchToHttp().getResponse()
    const accessToken = req.get('Authorization')
    if (!accessToken) throw new ForbiddenException('请先登录')
    const atUserId = this.userService.verifyToken(accessToken) // 自定义 token 校验
    if (!atUserId) throw new UnauthorizedException('当前登录已过期，请重新登录')
    return this.activate(ctx)
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>
  }
}
```

修改全局守卫

```
// app.module.ts

@Module({
  ...

   providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
}
```


```allowAnon``` 装饰器使用

```javascript
@Post('login')
@ApiOperation({ summary: '登录' })
@ApiResult(CreateTokenDto)
@AllowAnon()
async login(@Body() dto: LoginUser): Promise<ResultData> {
  return await this.userService.login(dto.account, dto.password)
}
```
