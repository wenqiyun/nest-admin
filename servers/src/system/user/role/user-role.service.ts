import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository, DataSource, EntityManager } from 'typeorm'
import { plainToInstance, instanceToPlain } from 'class-transformer'

import { ResultData } from '../../../common/utils/result'
import { RedisService } from '../../../common/libs/redis/redis.service'
import { getRedisKey } from '../../../common/utils/utils'
import { AppHttpCode } from '../../../common/enums/code.enum'
import { RedisKeyPrefix } from '../../../common/enums/redis-key-prefix.enum'

import { PermService } from '../../perm/perm.service'

import { UserRoleEntity } from './user-role.entity'

import { CreateOrUpdateUserRolesDto } from '../dto/create-user-roles.dto'

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly userManager: EntityManager,
  ) {}

  /** 创建 or 更新用户-角色 */
  async createOrUpdateUserRole(dto: CreateOrUpdateUserRolesDto): Promise<ResultData> {
    const userRoleList = plainToInstance(
      UserRoleEntity,
      dto.roleIds.map((roleId) => {
        return { roleId, userId: dto.userId }
      }),
    )
    const res = await this.userManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(UserRoleEntity, { userId: dto.userId })
      const result = await transactionalEntityManager.save<UserRoleEntity>(userRoleList)
      return result
    })
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '用户更新角色失败')
    await this.redisService.set(getRedisKey(RedisKeyPrefix.USER_ROLE, dto.userId), JSON.stringify(dto.roleIds))
    return ResultData.ok()
  }

  /** 生成用户角色关系, 单个角色， 多个用户 */
  async createOrCancelUserRole(
    userIds: string[],
    roleId: string,
    createOrCancel: 'create' | 'cancel',
    currActionUserId: string,
  ): Promise<ResultData> {
    if (userIds.includes(currActionUserId)) {
      // 绑定取消关系中，包含自身，一般自己不可操作自己的权限
      return ResultData.fail(AppHttpCode.ROLE_NO_FORBIDDEN, '当前登录用户不可改变自己的角色')
    }
    const res = await this.userManager.transaction(async (transactionalEntityManager) => {
      if (createOrCancel === 'create') {
        const dto = plainToInstance(
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
    if (res) {
      // 清除角色更新的用户缓存
      const keys = []
      userIds.forEach((userId) => {
        keys.push(
          ...[
            getRedisKey(RedisKeyPrefix.USER_MENU, userId),
            getRedisKey(RedisKeyPrefix.USER_PERM, userId),
            getRedisKey(RedisKeyPrefix.USER_ROLE, userId),
          ],
        )
      })
      await this.redisService.getClient().unlink(keys)
      return ResultData.ok()
    } else
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, `${createOrCancel === 'create' ? '添加' : '取消'}用户关联失败`)
  }

  /** 查询单个用户所拥有的角色 id */
  async findUserRole(id: string): Promise<ResultData> {
    const roleIds = await this.findUserRoleByUserId(id)
    return ResultData.ok(roleIds)
  }

  /**
   * @param roleId 角色 id
   * @param isCorrelation 是否相关联， true 查询拥有当前 角色的用户， false 查询无当前角色的用户
   * 由于超管自动拥有所有权限，所以查询都排除超管
   */
  async findUserByRoleId(roleId: string, page: number, size: number, isCorrelation: boolean): Promise<ResultData> {
    let res
    if (isCorrelation) {
      res = await this.dataSource
        .createQueryBuilder('sys_user', 'su')
        .leftJoinAndSelect('sys_user_role', 'ur', 'ur.user_id = su.id')
        .where('su.type != 0 and su.status = 1 and ur.role_id = :roleId', { roleId })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    } else {
      res = await this.dataSource
        .createQueryBuilder('sys_user', 'su')
        .where((qb: any) => {
          const subQuery = qb
            .subQuery()
            .select(['sur.user_id'])
            .from('sys_user_role', 'sur')
            .where('sur.role_id = :roleId', { roleId })
            .getQuery()
          return `su.type != 0 and su.status = 1 and su.id not in ${subQuery}`
        })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    }
    return ResultData.ok({ list: instanceToPlain(res[0]), total: res[1] })
  }

  /** 根据用户id 查询角色 id 集合 */
  async findUserRoleByUserId(id: string): Promise<string[]> {
    const userRoleKey = getRedisKey(RedisKeyPrefix.USER_ROLE, id)
    const result = await this.redisService.get(userRoleKey)
    if (result) return JSON.parse(result)
    else {
      const roles = await this.userRoleRepo.find({ select: ['roleId'], where: { userId: id } })
      const roleIds = roles.map((v) => v.roleId)
      await this.redisService.set(userRoleKey, JSON.stringify(roleIds))
      return roleIds
    }
  }
}
