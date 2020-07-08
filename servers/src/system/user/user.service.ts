import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Repository, Like } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { classToPlain } from 'class-transformer'

import { CryptoUtil } from '../../common/utils/crypto.util'
import { ResponseData } from '../../common/interfaces/result.interface'

import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'
import { CreateUserRoleDto } from '../relationalEntities/userRole/dto/create-userRole.dto'
import { UpdatePwDto } from './dto/update-pw-dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    private readonly cryptoUtil: CryptoUtil,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  // 根据用户名查询用户信息
  async findOneByAccount(account: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ account })
  }

  // 根据用户id查询用户信息, 只查用户表，
  async findOneById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne(id)
  }

  // 新用户注册
  async create(dto: CreateUserDto): Promise<ResponseData> {
    // 检查用户名是否存在
    const existing = await this.findOneByAccount(dto.account)
    if (existing) throw new HttpException('账号已存在', HttpStatus.BAD_REQUEST)
    // 判断密码是否相等
    if (dto.password !== dto.confirmPassword) throw new HttpException('两次输入密码不一致，请重试', HttpStatus.BAD_REQUEST)
    // 密码加密
    dto.password = this.cryptoUtil.encryptPassword(dto.password)
    // 通过验证， 插入数据
    let findOneByname = new UserEntity()
    findOneByname = { ...dto, ...findOneByname }
    const result = await this.userRepository.save(findOneByname)
    return { statusCode: 200, message: '注册成功', data: result }
  }

  // 登录逻辑
  async login(dto: LoginUserDto): Promise<ResponseData> {
    // 查询用户
    const user = await this.findOneByAccount(dto.account)
    if (!user) throw new HttpException('账号或密码错误', HttpStatus.BAD_REQUEST)
    // 判断密码是否相等
    if (!this.cryptoUtil.checkPassword(dto.password, user.password)) throw new HttpException('账号或密码错误', HttpStatus.BAD_REQUEST)
    // 是否被禁用
    if (!user.status) throw new HttpException('该账号已被禁用，请切换账号登录', HttpStatus.FORBIDDEN)
    // 生成 token
    const tokens = await this.createToken({ id: user.id })
    // 返回生成的 token
    return { statusCode: 200, message: '登录成功', data: tokens }
  }

  // 根据 ID 查询用户详细信息
  async findOne(id: number): Promise<ResponseData> {
    const user = await this.userRepository.findOne(id, { relations: ['dept', 'userRoles'] })
    if (!user) throw new HttpException('该用户不存在或已删除', HttpStatus.BAD_REQUEST)
    return { statusCode: 200, message: '查询成功', data: classToPlain(user) }
  }

  // 查询列表
  async findList({ pageSize = 10, pageNum = 1, deptId, roleId, nickname, status }): Promise<ResponseData> {
    // !!nickname ? { nickname: Like(nickname) } : {}
    let users
    if (roleId) {
      users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('sys_user_role', 'ur', 'ur.user_id = user.id')
        .leftJoinAndSelect('user.dept', 'dept')
        .where('user.status = 1 and ur.role_id =:roleId', { roleId })
        .orderBy({
          'user.createDate': 'DESC',
          'user.id': 'DESC',
          'user.account': 'ASC',
          'user.nickname': 'ASC'
        })
        .skip(pageSize * (pageNum - 1))
        .take(pageSize)
        .getManyAndCount()
    } else if (deptId) {
      users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.dept_id =:deptId', { deptId })
        .orderBy({
          'user.createDate': 'DESC',
          'user.id': 'DESC',
          'user.account': 'ASC',
          'user.nickname': 'ASC'
        })
        .skip(pageSize * (pageNum - 1))
        .take(pageSize)
        .getManyAndCount()
    } else {
      const where = {
        ...(status ? { status } : null),
        ...(nickname ? { nickname: Like(`%${nickname}%`) } : null)
      }
      users = await this.userRepository
        .createQueryBuilder('user')
        // 'user.nickname like :name', { name: `%${nickname}%` }
        .leftJoinAndSelect('user.dept', 'dept')
        .where(where)
        .orderBy({
          'user.createDate': 'DESC',
          'user.id': 'DESC',
          'user.account': 'ASC',
          'user.nickname': 'ASC'
        })
        .skip(pageSize * (pageNum - 1))
        .take(pageSize)
        .getManyAndCount()
    }

    return { statusCode: 200, message: '查询用户列表成功', data: { list: classToPlain(users[0]), total: users[1] } }
  }

  // 根据roleId 查询未绑定该 role 的用户
  // SELECT u.id, u.nickname FROM sys_user u WHERE u.id  <> ALL (select DISTINCT ur.user_id from sys_user_role ur where ur.role_id = 11)
  async findUserListNotInRoleId({ roleId, pageSize = 10, pageNum = 1 }): Promise<ResponseData> {
    const users = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.nickname'])
      .where('u.status = 1')
      .andWhere((qb) => {
        const subQuery = qb.subQuery().select('DISTINCT ur.user_id').from('sys_user_role', 'ur').where('ur.role_id =:roleId', { roleId }).getQuery()
        return 'u.id <> ALL ' + subQuery
      })
      .orderBy({
        'u.id': 'DESC',
        'u.nickname': 'ASC'
      })
      .skip(pageSize * (pageNum - 1))
      .take(pageSize)
      .getManyAndCount()
    return { statusCode: 200, message: '查询用户列表成功', data: { list: classToPlain(users[0]), total: users[1] } }
  }

  /**
   * 更新用户信息
   * @param id 用户id
   * @parm updataInput updateInput
   */
  async update(dto: UpdateUserDto): Promise<ResponseData> {
    const existing = await this.userRepository.findOne(dto.id)
    if (!existing) throw new HttpException(`更新失败，ID 为 ${dto.id} 的用户不存在`, 404)
    // 删除该用户原有关联角色
    await this.cancelUserRoleRelation(dto.id)
    const user: UserEntity = Object.assign(existing, dto) as UserEntity
    const result = await this.userRepository.save(user)
    if (!result) return { statusCode: 200, message: '用户信息修改失败' }
    return { statusCode: 200, message: '用户信息修改成功' }
  }

  // 修改用户自身密码
  async updatePw(dto: UpdatePwDto): Promise<ResponseData> {
    // 判断密码确认密码是否相等
    if (dto.newPassword !== dto.confirmPassword) return { statusCode: 500, message: '确认密码与新密码不一致' }
    // 查找用户，判断密码
    const user = await this.findOneById(dto.id)
    // 判断密码是否相等
    if (!this.cryptoUtil.checkPassword(dto.newPassword, user.password)) return { statusCode: 501, message: '密码错误' }
    return { statusCode: 200, message: '修改密码成功' }
  }

  /**
   * 管理员重置某个账户的密码
   * 重置后的密码，先写死 123456 后写入配置文件
   */
  async resetPossword(id: number): Promise<ResponseData> {
    await this.userRepository.update(id, { password: this.cryptoUtil.encryptPassword('123456') })
    return { statusCode: 200, message: '重置密码成功' }
  }
  /**
   * 删除用户， 不物理删除，只做禁用
   * @param id 用户id
   */
  async updateStatus(id: number, status: string): Promise<ResponseData> {
    const existing = await this.userRepository.findOne(id)
    if (!existing) throw new HttpException(`${status ? '启用' : '禁用'} ID 为 ${id} 的用户不存在`, 404)
    await this.userRepository.update(id, { status: status ? !!parseInt(status) : false })
    return { statusCode: 200, message: '删除成功' }
  }

  // 删除用户与角色关联关系
  async cancelUserRoleRelation(userId: number): Promise<ResponseData> {
    const result = await this.userRoleRepository.delete({ userId })
    if (!result) return { statusCode: 500, message: '当前关联用户已取消关联或不存在' }
    return { statusCode: 200, message: '已取消关联' }
  }

  // 创建用户与角色关联
  async createUserRoleRelation(dtos: CreateUserRoleDto[]): Promise<ResponseData> {
    const result = await this.userRoleRepository.save(dtos)
    if (!result) return { statusCode: 500, message: '关联用户失败，请重新关联' }
    return { statusCode: 200, message: '关联用户成功' }
  }

 /**
   * 生成 token
   * @param payload { id: string } 
   */
  async createToken(payload: { id: number }): Promise<Record<string, unknown>> {
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.config.get('JWT.refreshExpiresIn') })
    return { accessToken, refreshToken }
  }

  async refreshToken (id: number): Promise<Record <string, unknown>> {
    return this.createToken({ id })
  }

  async verifyToken (token: string): Promise<number> {
    try {
      const { id } = this.jwtService.verify(token)
      return id
    } catch (error) {
      return 0
    }
  }
}
