import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository, getManager, getConnection, In } from 'typeorm'
import { classToPlain, plainToClass } from 'class-transformer'
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs'
import xlsx from 'node-xlsx'

import { ResultData } from '../../common/utils/result'
import { getRedisKey, formatSecond } from '../../common/utils/utils';
import { RedisKeyPrefix } from '../../common/enums/redis-key-prefix.enum'
import { RedisUtilService } from '../../common/libs/redis/redis.service'
import { validPhone, validEmail } from '../../common/utils/validate'

import { JwtUtilService } from '../jwt/jwt.service'

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
    private readonly jwtUtilService: JwtUtilService,
    private readonly redisUtilService: RedisUtilService,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id)
    const result = await this.redisUtilService.hGetAll(redisKey)
    // plainToClass 去除 password slat
    let user = plainToClass(UserEntity, result, { enableImplicitConversion: true })
    if (!user?.id) {
      user = await this.userRepo.findOne(id)
      user = plainToClass(UserEntity, { ...user }, { enableImplicitConversion: true })
      await this.redisUtilService.hmset(redisKey, classToPlain(user), formatSecond(this.config.get<string>('jwt.expiresin')))
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
    if (dto.password !== dto.confirmPassword) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '两次输入密码不一致，请重试')
    // 防止重复创建 start
    if (await this.findOneByAccount(dto.account)) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '帐号已存在，请调整后重新注册！')
    if (await this.userRepo.findOne({ phoneNum: dto.phoneNum })) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '当前手机号已存在，请调整后重新注册')
    if (await this.userRepo.findOne({ email: dto.email })) return ResultData.fail(HttpStatus.NOT_ACCEPTABLE, '当前邮箱已存在，请调整后重新注册')
    // 防止重复创建 end
    const salt = await genSalt()
    dto.password = await hash(dto.password, salt)
    // plainToClass  忽略转换 @Exclude 装饰器
    const user = plainToClass(UserEntity, { salt, ...dto }, { ignoreDecorators: true })
    const result = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<UserEntity>(user)
    })
    return ResultData.ok(classToPlain(result))
  }

  /**
   * 登录
   * account 有可能是 帐号/手机/邮箱
   */
  async login(account: string, password: string): Promise<ResultData> {
    let user = null
    if (validPhone(account)) { // 手机登录
      user = await this.userRepo.findOne({ phoneNum: account })
    } else if (validEmail(account)) { // 邮箱
      user = await this.userRepo.findOne({ email: account })
    } else { // 帐号
      user = await this.findOneByAccount(account)
    }
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '帐号或密码错误')
    const checkPassword = await compare(password, user.password)
    if (!checkPassword) return ResultData.fail(HttpStatus.NOT_FOUND, '帐号或密码错误')
    if (user.status === 0) return ResultData.fail(HttpStatus.BAD_REQUEST, '您已被禁用，如需要正常使用请联系管理员')
    // 生成 token
    const data = this.jwtUtilService.genToken({ id: user.id })
    return ResultData.ok(data)
  }

  /**
   * 批量导入用户
   */
  async importUsers (file: Express.Multer.File): Promise<ResultData> {
    const acceptFileType = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!acceptFileType.indexOf(file.mimetype)) return ResultData.fail(HttpStatus.BAD_REQUEST, '文件类型错误，请上传 .xls 或 .xlsx 文件')
    if (file.size > 5 * 1024 * 1024) return ResultData.fail(HttpStatus.BAD_REQUEST, '文件大小超过，最大支持 5M')
    const workSheet = xlsx.parse(file.buffer)
    // 需要处理 excel 内帐号 手机号 邮箱 是否有重复的情况
    if (workSheet[0].data.length === 0) return ResultData.fail(HttpStatus.BAD_REQUEST, 'excel 导入数据为空')
    const userArr = []
    const accountMap = new Map()
    const phoneMap = new Map()
    const emailMap = new Map()
    // 从 1 开始是去掉 excel 帐号等文字提示
    for (let i = 1, len = workSheet[0].data.length; i < len; i++) {
      const dataArr = workSheet[0].data[i]
      if (dataArr.length === 0) break
      const [ account, phone, email, avatar ] = dataArr
      userArr.push({ account, phoneNum: phone, email, avatar})
      if (account && !accountMap.has(account)) {
        accountMap.set(account, [])
      } else if (account) { // 有重复的
        accountMap.get(account).push(i + 1)
      } else {
        return ResultData.fail(HttpStatus.BAD_REQUEST, '上传文件帐号有空数据，请检查后再导入')
      }
      if (!phoneMap.has(phone)) {
        phoneMap.set(phone, [])
      } else if (phone) {
        phoneMap.get(phone).push(i + 1)
      }
      if (email && !emailMap.has(email)) {
        emailMap.set(email, [])
      } else if (email){
        emailMap.get(email).push(i + 1)
      }
    }
    const accountErrArr = []
    for (let [key, val] of accountMap) {
      if (val.length > 0) {
        accountErrArr.push({ key, val })
      }
    }
    const phoneErrArr = []
    for (let [key, val] of phoneMap) {
      if (val.length > 0) {
        phoneErrArr.push({ key, val })
      }
    }
    const emailErrArr = []
    for (let [key, val] of emailMap) {
      if (val.length > 0) {
        emailErrArr.push({ key, val })
      }
    }
    if (accountErrArr.length > 0 || phoneErrArr.length > 0 || emailErrArr.length > 0) {
      return ResultData.fail(400500, '导入 excel 内部有数据重复或数据有误，请修改调整后上传导入', { account: accountErrArr, phone: phoneErrArr, email: emailErrArr})
    }
    // 若 excel 内部无重复，则需要判断 excel 中数据 是否与 数据库的数据重复
    const existingAccount = await this.userRepo.find({ select: ['account'],  where: { account: In(userArr.map(v => v.account)) } })
    if (existingAccount.length > 0) {
      existingAccount.forEach(v => {
        // userArr 中的数据 下标 换算成 excel 中的 行号 + 2
        accountErrArr.push({ key: v.account, val: [userArr.findIndex(m => m.account === v.account) + 2] })
      })
    }
    // 手机号、邮箱非必填，所以查询存在重复的 过滤掉 空数据
    const existingPhone = await this.userRepo.find({ select: ['phoneNum'],  where: { account: In(userArr.map(v => v.phoneNum).filter(v => !!v)) } })
    if (existingPhone.length > 0) {
      existingPhone.forEach(v => {
        // userArr 中的数据 下标 换算成 excel 中的 行号 + 2
        phoneErrArr.push({ key: v.phoneNum, val: [userArr.findIndex(m => m.phoneNum === v.phoneNum) + 2]})
      })
    }
    const existingEmail = await this.userRepo.find({ select: ['email'],  where: { account: In(userArr.map(v => v.email).filter(v => !!v)) } })
    if (existingEmail.length > 0) {
      existingEmail.forEach(v => {
        // userArr 中的数据 下标 换算成 excel 中的 行号 + 2
        emailErrArr.push({ key: v.email, val: [userArr.findIndex(m => m.email === v.email) + 2] })
      })
    }
    if (accountErrArr.length > 0 || phoneErrArr.length > 0 || emailErrArr.length > 0) {
      return ResultData.fail(400500, '导入 excel 系统中已有重复项，请修改调整后上传导入', { account: accountErrArr, phone: phoneErrArr, email: emailErrArr})
    }
    // excel 与数据库无重复，准备入库
    const password = this.config.get<string>('user.initialPassword')
    userArr.forEach(v => {
      const salt = genSaltSync()
      const encryptPw = hashSync(password, salt)
      v['password'] = encryptPw
      v['salt'] = salt
    })
    const result =  await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<UserEntity>(plainToClass(UserEntity, userArr, { ignoreDecorators: true }))
    })
    return ResultData.ok(classToPlain(result))
  }

  /** 更新用户信息 */
  async update(dto: UpdateUserDto): Promise<ResultData> {
    const existing = await this.findOneById(dto.id)
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, '当前用户不存在或已删除')
    if (existing.status === 0) return ResultData.fail(HttpStatus.BAD_REQUEST, '当前用户已被禁用，不可更新用户信息')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, dto.id, dto)
    })
    if (!affected) ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '更新失败，请稍后重试')
    await this.redisUtilService.hmset(getRedisKey(RedisKeyPrefix.USER_INFO, dto.id), dto)
    // redis 更新用户信息
    return ResultData.ok()
  }

  /**
   * 启用 / 禁用 用户
   * @param userId
   * @param status
   * @returns
   */
  async updateStatus(userId: string, status: 0 | 1): Promise<ResultData> {
    const existing = await this.findOneById(userId)
    if (!existing) ResultData.fail(HttpStatus.NOT_FOUND, '当前用户不存在或已删除')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, userId, { id: userId, status })
    })
    if (!affected) ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '更新失败，请稍后尝试')
    await this.redisUtilService.hmset(getRedisKey(RedisKeyPrefix.USER_INFO, userId), { status })
    return ResultData.ok()
  }

  /**
   * 更新或重置用户密码
   * @reset 是否重置, false 则使用传入的 password 更新
   */
  async updatePassword (userId: string, password: string, reset: boolean): Promise<ResultData> {
    const existing = await this.userRepo.findOne(userId)
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, `用户不存在或已删除，${reset ? '重置' : '更新'}失败`)
    if (existing.status === 0) return ResultData.fail(HttpStatus.BAD_REQUEST, '当前用户已被禁用，不可重置用户密码')
    const newPassword = reset ? this.config.get<string>('user.initialPassword') : password
    const user = { id: userId, password: await hash(newPassword, existing.salt) }
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<UserEntity>(UserEntity, userId, user)
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
  async findOne(id: string): Promise<ResultData> {
    const user = await this.findOneById(id)
    if (!user) return ResultData.fail(HttpStatus.NOT_FOUND, '该用户不存在或已删除')
    return ResultData.ok(classToPlain(user))
  }

  /** 查询单个用户所拥有的角色 id */
  async findUserRole(id: string): Promise<ResultData> {
    const roleIds = await this.findUserRoleByUserId(id)
    return ResultData.ok(roleIds)
  }

  /** 生成用户角色关系, 单个角色， 多个用户 */
  async createOrCancelUserRole(userIds: string[], roleId: string, createOrCancel: 'create' | 'cancel'): Promise<ResultData> {
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
  private async findUserByRoleId(roleId: string, page: number, size: number, isCorrelation: boolean): Promise<ResultData> {
    let res
    if (isCorrelation) {
      res = await getConnection()
        .createQueryBuilder('sys_user', 'su')
        .leftJoinAndSelect('sys_user_role', 'ur', 'ur.user_id = su.id')
        .where('su.status = 1 and ur.role_id = :roleId', { roleId })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    } else {
      // 查询需要优化
      res = await getConnection()
        .createQueryBuilder('sys_user', 'su')
        .where((qb: any) => {
          const subQuery = qb.subQuery()
            .select(['sur.user_id'])
            .from('sys_user_role', 'sur')
            .where('sur.role_id = :roleId', { roleId })
            .getQuery()
          return `su.status = 1 and su.id not in ${subQuery}`
        })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    }
    return ResultData.ok({ list: classToPlain(res[0]), total: res[1] })
  }

  /** 根据用户id 查询角色 id 集合 */
  async findUserRoleByUserId(id: string): Promise<number[]> {
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
}
