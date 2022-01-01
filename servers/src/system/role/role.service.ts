import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager, Like, getConnection } from 'typeorm'
import { plainToClass } from 'class-transformer'

import { AppHttpCode } from '../../common/enums/code.enum'
import { UserType } from '../../common/enums/common.enum'
import { ResultData } from '../../common/utils/result'

import { UserRoleEntity } from '../user/user-role.entity'

import { RoleEntity } from './role.entity'
import { RoleMenuEntity } from './role-menu.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { UserEntity } from '../user/user.entity'


@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepo: Repository<RoleMenuEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>
  ) {}

  async create(dto: CreateRoleDto, user: UserEntity): Promise<ResultData> {
    const role = plainToClass(RoleEntity, dto)
    const res = await getManager().transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.save<RoleEntity>(plainToClass(RoleEntity, role))
      if (result) {
        const roleMenus = plainToClass(
          RoleMenuEntity,
          dto.menuIds.map((menuId) => {
            return { menuId, roleId: result.id }
          }),
        )
        await transactionalEntityManager.save<RoleMenuEntity>(roleMenus)
        if (user.type === UserType.ORDINARY_USER) {
          // 如果是 一般用户，则需要将 他创建的角色绑定他自身， 超管用户因为可以查看所有角色，则不需要绑定
          const userRole = { userId: user.id, roleId: result.id }
          await transactionalEntityManager.save<UserRoleEntity>(plainToClass(UserRoleEntity, userRole))
        }
      }
      return result
    })
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '角色创建失败，请稍后重试')
    return ResultData.ok(res)
  }

  async update(dto: UpdateRoleDto): Promise<ResultData> {
    const existing = await this.roleRepo.findOne({ id: dto.id })
    if (!existing) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前角色不存在或已被删除')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      if (dto.menuIds) {
        await transactionalEntityManager.delete(RoleMenuEntity, { roleId: dto.id })
        await transactionalEntityManager.save(
          RoleMenuEntity,
          plainToClass(
            RoleMenuEntity,
            dto.menuIds?.map((menuId) => {
              return { menuId, roleId: dto.id }
            }),
          ),
        )
      }
      const updateRole = { id: dto.id, ...(dto.name ? { name: dto.name } : null), ...(dto.remark ? { remark: dto.remark } : null) }
      const result = await transactionalEntityManager.update<RoleEntity>(RoleEntity, dto.id, plainToClass(RoleEntity, updateRole))
      return result
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前角色更新失败，请稍后尝试')
    return ResultData.ok()
  }

  async delete(id: string): Promise<ResultData> {
    const existing = await this.roleRepo.findOne({ id })
    if (!existing) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前角色不存在或已被删除')
    const existingBindUser = await this.userRoleRepo.findOne({ where: { roleId: id } })
    if (existingBindUser) return ResultData.fail(AppHttpCode.ROLE_NOT_DEL, '当前角色还有绑定的用户，需要解除关联后删除')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      // 删除 role - menu 关系
      await transactionalEntityManager.delete(RoleMenuEntity, { roleId: id })
      // 删除 user - role 关系
      // await transactionalEntityManager.delete(UserRoleEntity, { roleId: id })
      const result = await transactionalEntityManager.delete<RoleEntity>(RoleEntity, id)
      return result
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除失败，请稍后重试')
    return ResultData.ok()
  }

  async findOnePerm(id: string): Promise<ResultData> {
    const roleMenu = await this.roleMenuRepo.find({ select: ['menuId'], where: { roleId: id } })
    return ResultData.ok(roleMenu.map((v) => v.menuId))
  }

  async findList(type: UserType, userId: string): Promise<ResultData> {
    let roleData = []
    if (type === UserType.SUPER_ADMIN) {
      roleData = await this.roleRepo.find({ order: { id: 'DESC' } })
    } else {
      roleData = await getConnection()
        .createQueryBuilder('sys_role', 'sr')
        .leftJoinAndSelect('sys_user_role', 'sur', 'sr.id = sur.role_id')
        .where('sur.user_id = :userId', { userId })
        .getMany()
    }
    return ResultData.ok(roleData)
  }
}
