import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Like, Repository, getManager, getConnection } from 'typeorm'
import { classToPlain, plainToClass } from 'class-transformer'
import { genSalt, hash, compare } from 'bcrypt'

import { ResultData } from '../../common/utils/result'
import { getRedisKey } from '../../common/utils/utils'
import { RedisKeyPrefix } from '../../common/enums/redis-key-prefix.enum'
import { RedisUtilService } from '../../common/libs/redis/redis.service'

import { UserEntity } from './user.entity'
import { UserRoleEntity } from './user-role.entity'

import { CreateUserDto } from './dto/create-user.dto'
import { FindUserListDto } from './dto/find-user-list.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateOrUpdateUserRolesDto } from './dto/create-user-roles.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisUtilService: RedisUtilService,
  ) {}

  async findOneById(id: number): Promise<UserEntity> {
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id)
    const result = await this.redisUtilService.hGetAll(redisKey)
    // plainToClass 去除 password slat
    let user = plainToClass(UserEntity, result, { enableImplicitConversion: true })
    if (!user?.id) {
      user = await this.userRepo.findOne(id)
      user = plainToClass(UserEntity, { ...user }, { enableImplicitConversion: true })
      await this.redisUtilService.hmset(redisKey, classToPlain(user))
    }
    user.password = ''
    user.salt = ''
    return user
  }

  async findOneByAccount(account: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ account })
  }

  /** 创建用户 */
  async create(dto: CreateUserDto): Promise<ResultData> {
    const existing = await this.findOneByAccount(dto.account)
    if (existing) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '账号已存在，请调整后重新注册！')
    if (dto.password !== dto.confirmPassword) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '两次输入密码不一致，请重试')
    const salt = await genSalt()
    dto.password = await hash(dto.password, salt)
    // plainToClass  忽略转换 @Exclude 装饰器
    const user = plainToClass(UserEntity, { salt, ...dto }, { ignoreDecorators: true })
    const result = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<UserEntity>(user)
    })
    return ResultData.ok(classToPlain(result))
  }

  /** 更新用户信息 */
  async login(account: string, password: string): Promise<ResultData> {
    const user = await this.findOneByAccount(account)
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '账号或密码错误')
    const checkPassword = await compare(password, user.password)
    if (!checkPassword) return ResultData.fail(HttpStatus.NOT_FOUND, '账号或密码错误')
    // 生成 token
    const data = this.genToken({ id: user.id })
    return ResultData.ok(data)
  }

  /** 更新用户信息 */
  async update(dto: UpdateUserDto): Promise<ResultData> {
    const existing = await this.findOneById(dto.id)
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, '当前用户不存在或已删除')
    // 如果有更新密码
    if (dto.password) {
      if (dto.password !== dto.confirmPassword) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '两次输入密码不一致，请重试')
      dto.password = await hash(dto.password, existing.salt)
    }
    const user = plainToClass(UserEntity, dto)
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, dto.id, user)
    })
    if (!affected) ResultData.fail(HttpStatus.NOT_FOUND, '更新失败，请稍后重试')
    await this.redisUtilService.hmset(getRedisKey(RedisKeyPrefix.USER_INFO, dto.id), dto)
    // redis 更新用户信息
    return ResultData.ok()
  }

  /**
   * 更新或重置用户密码
   * @reset 是否重置, false 则使用传入的 password 更新
   */
  async updatePassword (userId: number, password: string, reset: boolean): Promise<ResultData> {
    const existing = await this.userRepo.findOne(userId)
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, `用户不存在或已删除，${reset ? '重置' : '更新'}失败`)
    const newPassword = reset ? this.config.get<string>('user.initialPassword') : password
    const user = { id: userId, password: await hash(newPassword, existing.salt) }
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, userId, plainToClass(UserEntity, { ...existing , ...user }))
    })
    if (!affected) ResultData.fail(HttpStatus.NOT_FOUND, `${reset ? '重置' : '更新'}失败，请稍后重试`)
    return ResultData.ok()
  }

  /** 创建 or 更新用户-角色 */
  async createOrUpdateUserRole(dto: CreateOrUpdateUserRolesDto): Promise<ResultData> {
    const userRoleList = plainToClass(
      UserRoleEntity,
      dto.roleIds.map((roleId) => {
        return { roleId, userId: dto.userId }
      }),
    )
    const res = await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(UserRoleEntity, { userId: dto.userId })
      const result = await transactionalEntityManager.save<UserRoleEntity>(userRoleList)
      return result
    })
    if (!res) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '用户更新角色失败')
    await this.redisUtilService.set(getRedisKey(RedisKeyPrefix.USER_ROLE, dto.userId), JSON.stringify(dto.roleIds))
    return ResultData.ok()
  }

  /** 查询用户列表 */
  async findList(dto: FindUserListDto): Promise<ResultData> {
    const { page, size, account, status, roleId, hasCurrRole = 0 } = dto
    if (roleId) {
      console.log(hasCurrRole, 90)
      const result = await this.findUserByRoleId(roleId, page, size, !!Number(hasCurrRole))
      return result
    }
    const where = {
      ...(status ? { status } : null),
      ...(account ? { account: Like(`%${account}%`) } : null),
    }
    const users = await this.userRepo.findAndCount({ where, order: { id: 'DESC' }, skip: size * (page - 1), take: size })
    return ResultData.ok({ list: classToPlain(users[0]), total: users[1] })
  }

  /** 查询单个用户 */
  async findOne(id: number): Promise<ResultData> {
    const user = await this.findOneById(id)
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '该用户不存在或已删除')
    return ResultData.ok(classToPlain(user))
  }

  /** 查询单个用户所拥有的角色 id */
  async findUserRole(id: number): Promise<ResultData> {
    const roleIds = await this.findUserRoleByUserId(id)
    return ResultData.ok(roleIds)
  }

  /** 生成用户角色关系, 单个角色， 多个用户 */
  async createOrCancelUserRole(userIds: number[], roleId: number, createOrCancel: 'create' | 'cancel'): Promise<ResultData> {
    const res = await getManager().transaction(async (transactionalEntityManager) => {
      if (createOrCancel === 'create') {
        const dto = plainToClass(
          UserRoleEntity,
          userIds.map((userId) => {
            return { roleId, userId }
          }),
        )
        return await transactionalEntityManager.save<UserRoleEntity>(dto)
      } else {
        return await transactionalEntityManager.delete(UserRoleEntity, { roleId, userId: userIds })
      }
    })
    if (res) return ResultData.ok()
    else return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, `${createOrCancel === 'create' ? '添加' : '取消'}用户关联失败`)
  }

  /**
   * @param roleId 角色 id
   * @param isCorrelation 是否相关联， true 查询拥有当前 角色的用户， false 查询无当前角色的用户
   */
  private async findUserByRoleId(roleId: number, page: number, size: number, isCorrelation: boolean): Promise<ResultData> {
    let res
    if (isCorrelation) {
      res = await getConnection()
        .createQueryBuilder('sys_user', 'su')
        .leftJoinAndSelect('sys_user_role', 'ur', 'ur.user_id = su.id')
        .where('ur.role_id = :roleId', { roleId })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    } else {
      // 查询需要优化
      res = await getConnection()
        .createQueryBuilder('sys_user', 'su')
        .where((qb: any) => {
          const subQuery = qb.subQuery().select(['sur.user_id']).from('sys_user_role', 'sur').where('sur.role_id = :roleId', { roleId }).getQuery()
          console.log(subQuery)
          return 'su.id not in ' + subQuery
        })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    }
    return ResultData.ok({ list: classToPlain(res[0]), total: res[1] })
  }

  /** 根据用户id 查询角色 id 集合 */
  async findUserRoleByUserId(id: number): Promise<number[]> {
    const userRoleKey = getRedisKey(RedisKeyPrefix.USER_ROLE, id)
    const result = await this.redisUtilService.get(userRoleKey)
    if (result) return JSON.parse(result)
    else {
      const roles = await this.userRoleRepo.find({ select: ['roleId'], where: { userId: id } })
      const roleIds = roles.map((v) => v.roleId)
      await this.redisUtilService.set(userRoleKey, JSON.stringify(roleIds))
      return roleIds
    }
  }

  /** 生成 token */
  genToken(payload: { id: number }): Record<string, unknown> {
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.config.get('jwt.refreshExpiresIn') })
    return { accessToken, refreshToken }
  }

  /** 刷新 token */
  refreshToken(id: number): string {
    return this.jwtService.sign({ id })
  }

  /** 校验 token */
  verifyToken(token: string): number {
    try {
      if (!token) return 0
      const id = this.jwtService.verify(token.replace('Bearer ', ''))
      return id
    } catch (error) {
      return 0
    }
  }
}
