通过上一节关于 ```JWT``` 实现的介绍，权限验证我们依然可以使用守卫来做。


#### 实现

那怎么判断用户是否有路由权限呢，我们回顾下[数据库表设计](/back-end/database?id=%e6%95%b0%e6%8d%ae%e5%ba%93%e8%a1%a8%e8%ae%be%e8%ae%a1)

用户拥有角色，角色拥有菜单，菜单拥有 api ， 那通过用户就可以查到用户所拥有的 api 再和当前路由做对比，不就可以判断该用户是否拥有当前请求的权限了吗

依赖

```sh
# path-to-regexp 的作用是转换成正则，然后对比
# 如 /user/:id/info 根据 id 查询某用户信息，这种路由中间路径是一个变量，可以是任何值，很难用相等判断，
# 所以使用 path-to-regexp 可以快速的对比出来
npm i path-to-regexp
```

权限守卫

```javascript
@Injectable()
export class RolesGuard implements CanActivate {
  private globalWhiteList = []
  constructor(
    private readonly reflector: Reflector,
    @Inject(PermService)
    private readonly permService: PermService,
    private readonly config: ConfigService,
  ) {
    this.globalWhiteList = [].concat(this.config.get('perm.router.whitelist') || [])
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // 首先 无 token 的 是不需要 对比权限
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [ctx.getHandler(), ctx.getClass()])
    if (allowAnon) return true
    // 全局配置，
    const req = ctx.switchToHttp().getRequest()

    const i = this.globalWhiteList.findIndex(route => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        return !!pathToRegexp(route.path).exec(req.url)
      }
      return false
    })
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    if (i > -1) return true
    // 函数请求头配置 AllowNoPerm 装饰器 无需验证权限
    const allowNoPerm = this.reflector.getAllAndOverride<boolean>(ALLOW_NO_PERM, [ctx.getHandler(), ctx.getClass()])
    if (allowNoPerm) return true

    // 需要比对 该用户所拥有的 接口权限
    const user = req.user
    // 没有挈带 token 直接返回 false
    if (!user) return false
    // 超管
    if (user.type === UserType.SUPER_ADMIN) return true

    const userPermApi = await this.permService.findUserPerms(user.id)
    const index = userPermApi.findIndex(route => {
      // 请求方法类型相同
      if (req.method.toUpperCase() === route.method.toUpperCase()) {
        // 对比 url
        const reqUrl = req.url.split('?')[0]
        return !!pathToRegexp(route.path).exec(reqUrl)
      }
      return false
    })
    if (index === -1) new ForbiddenException('您无权限访问该接口')
    return true
  }
}

```


权限守卫挂载全局

```javascript
// app.module.ts

@Module({
  ...

   providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
}
```

> [!WARNING]
> 当前全局守卫是按顺序执行的，也就是说先验证 token ，再去验证用户是否有当前请求的权限


```allNoPerm``` 装饰器

```javascipt
import { SetMetadata } from '@nestjs/common'

/**
 * 接口 允许 无权限访问
 */
export const ALLOW_NO_PERM = 'allowNoPerm'

export const AllowNoPerm = () => SetMetadata(ALLOW_NO_PERM, true)
```

查找用户所拥有的 api 集合

> [!TIP]
> 由于本项目没有指定关联关系，所以多表联合查询只能使用自定义查询。

```javascript
export class PermService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly redisService: RedisUtilService,
  ) {}

  /**
   * 查询个人 拥有的 api 权限
   * 超管用户不用在这里处理，在 role.guard 守卫中判断是超管 直接 return true
   * 查询生成语句
    SELECT
      `rm`.`id` AS `rm_id`,
      `rm`.`role_id` AS `rm_role_id`,
      `rm`.`menu_id` AS `rm_menu_id`,
      `mp`.`id` AS `mp_id`,
      `mp`.`menu_id` AS `mp_menu_id`,
      `mp`.`api_url` AS `mp_api_url`,
      `mp`.`api_method` AS `mp_api_method`
    FROM
      `sys_user_role` `ur`
      LEFT JOIN `sys_role_menu` `rm` ON `ur`.`role_id` = `rm`.`role_id`
      LEFT JOIN `sys_menu_perm` `mp` ON `rm`.`menu_id` = mp.menu_id
    WHERE
      `ur`.`user_id` = 1
      AND
      `mp`.`menu_id` != 1 -- 去除 null, 关于 mysql null 是 没有值，当 != 的时候 null 属于没有值而被过滤掉
   * @param userId
   * @returns
   */
  async findUserPerms(userId: string): Promise<RouteDto[]> {
    // mp.menu_id != 1 去掉 有些角色可能没有菜单， 查询的时候 为 null, 不能直接 ！null
    const redisKey = getRedisKey(RedisKeyPrefix.USER_PERM, userId)
    const result = await this.redisService.get(redisKey)
    if (result) return JSON.parse(result)
    // const
    const permsResult = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu_perm', 'mp', 'rm.menu_id = mp.menu_id')
      .where('ur.user_id = :userId and mp.menu_id != 1', { userId })
      .getRawMany()
    const perms = permsResult.map(v => ({ path: v.mp_api_url, method: v.mp_api_method }))
    await this.redisService.set(redisKey, JSON.stringify(perms), ms(this.config.get<string>('jwt.expiresin')) / 1000)
    return perms
  }
}
```
