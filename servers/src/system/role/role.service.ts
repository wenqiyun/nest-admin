import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager, Like } from 'typeorm'
import { plainToClass } from 'class-transformer'

import { ResultData } from '../../common/utils/result'

import { RoleEntity } from './role.entity'
import { RoleMenuEntity } from './role-menu.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { FindRoleListDto } from './dto/find-role-list.dto'
import { UserRoleEntity } from '../user/user-role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepo: Repository<RoleMenuEntity>,
  ) {}

  async create(dto: CreateRoleDto): Promise<ResultData> {
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
      }
      return result
    })
    if (!res) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '角色创建失败，请稍后重试')
    return ResultData.ok(res)
  }

  async update(dto: UpdateRoleDto): Promise<ResultData> {
    const existing = await this.roleRepo.findOne({ id: dto.id })
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, '当前角色不存在或已被删除')
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
    if (!affected) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '当前角色更新失败，请稍后尝试')
    return ResultData.ok()
  }

  async delete(id: number): Promise<ResultData> {
    const existing = await this.roleRepo.findOne({ id })
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, '当前角色不存在或已被删除')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      // 删除 role - menu 关系
      await transactionalEntityManager.delete(RoleMenuEntity, { roleId: id })
      // 删除 user - role 关系
      await transactionalEntityManager.delete(UserRoleEntity, { roleId: id })
      const result = await transactionalEntityManager.delete<RoleEntity>(RoleEntity, id)
      return result
    })
    if (!affected) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '删除失败，请稍后重试')
    return ResultData.ok()
  }

  async findOnePerm(id: number): Promise<ResultData> {
    const roleMenu = await this.roleMenuRepo.find({ select: ['menuId'], where: { roleId: id } })
    return ResultData.ok(roleMenu.map((v) => v.menuId))
  }

  async findList(): Promise<ResultData> {
    const roleData = await this.roleRepo.find({ order: { id: 'DESC' } })
    return ResultData.ok(roleData)
  }
}
