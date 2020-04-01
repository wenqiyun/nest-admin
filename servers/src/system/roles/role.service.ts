import { Injectable, HttpException } from '@nestjs/common'
import { Repository, Like } from 'typeorm'
import { RoleEntity } from './role.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ResponseData } from 'src/common/interfaces/result.interface'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { CreateRoleMenuDto } from '../relationalEntities/roleMenu/dto/create-roleMenu.dto'
import { RoleMenuEntity } from '../relationalEntities/roleMenu/roleMenu.entity'
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepository: Repository<RoleMenuEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  // 查询所有角色
  async findAllList() {
    const roles = await this.roleRepository.find()
    return { statusCode: 200, message: '查询角色成功', data: roles }
  }

  // 查询角色列表 分页
  async findList(pageSize: number, pageNum: number, roleName: string): Promise<ResponseData> {
    const where = roleName ? { roleName: Like(`%${roleName}%`) } : {}
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .where(where)
      .skip(pageSize * (pageNum - 1))
      .take(pageSize)
      .getManyAndCount()
    return { statusCode: 200, message: '查询角色列表成功', data: { list: roles[0], total: roles[1] } }
  }

  // 查询单个角色详情
  async findOne(roleId: number): Promise<ResponseData> {
    const role = await this.roleRepository.findOne(roleId, {
      relations: ['roleMenus'],
    })
    if (!role) throw new HttpException(`查询失败， ID 为 ${roleId} 的角色不存在或已删除`, 404)
    return { statusCode: 200, message: '查询成功', data: role }
  }

  // 创建
  // @Transaction()
  async createRole(roleDto: CreateRoleDto): Promise<ResponseData> {
    try {
      const roles: RoleEntity = <RoleEntity>roleDto
      const createRoleResult = await this.roleRepository.save(roles)
      if (!createRoleResult) return { statusCode: 500, message: '创建失败' }
      return { statusCode: 200, message: '添加成功' }
    } catch (error) {
      return { statusCode: 500, message: '创建失败' }
    }
  }

  // 更新角色
  async updateRole(dto: UpdateRoleDto): Promise<ResponseData> {
    try {
      await this.deleteRoleMemuByRoleId(dto.roleId)
      const roles: RoleEntity = <RoleEntity>dto
      const result = await this.roleRepository.save(roles)
      if (!result) return { statusCode: 500, message: '更新失败' }
      return { statusCode: 200, message: '更新成功' }
    } catch (error) {
      return { statusCode: 500, message: '更新失败' }
    }
  }

  // 删除角色, 删除角色之前，删除用户角色关系，角色菜单关系
  async deleteRole(roleId: number): Promise<ResponseData> {
    await this.deleteRoleMemuByRoleId(roleId)
    await this.deleteUserRole(roleId)
    const result = await this.roleRepository.delete(roleId)
    if (!result) return { statusCode: 500, message: '角色删除失败' }
    return { statusCode: 200, message: '删除成功' }
  }

  // 删除角色用户关系
  async deleteUserRole(roleId: number): Promise<boolean> {
    const result = await this.userRoleRepository.delete({ roleId })
    return !!result
  }

  // 创建关系
  async createRoleMenu(dtos: CreateRoleMenuDto[]): Promise<boolean> {
    const result = await this.roleMenuRepository.save(dtos)
    return !!result
  }

  // 删除关系
  async deleteRoleMemuByRoleId(roleId: number): Promise<boolean> {
    const result = await this.roleMenuRepository.delete({ roleId })
    return !!result
  }
}
