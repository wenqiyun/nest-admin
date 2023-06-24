import { Injectable } from '@nestjs/common'
import { Repository, In, EntityManager } from 'typeorm'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'

import { ResultData } from '../../common/utils/result'
import { AppHttpCode } from '../../common/enums/code.enum'

import { PermService } from '../perm/perm.service'

import { MenuEntity } from './menu.entity'
import { MenuPermEntity } from './menu-perm.entity'
import { CreateMenuDto } from './dto/create-menu.dto'

import { UpdateMenuDto } from './dto/update-menu.dto'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepo: Repository<MenuEntity>,
    @InjectRepository(MenuPermEntity)
    private readonly menuPermRepo: Repository<MenuPermEntity>,
    @InjectEntityManager()
    private readonly menuManager: EntityManager,
    private readonly permService: PermService,
  ) {}

  async create(dto: CreateMenuDto): Promise<ResultData> {
    if (dto.parentId !== '0') {
      // 查询当前父级菜单是否存在
      const parentMenu = await this.menuRepo.findOne({ where: { id: dto.parentId } })
      if (!parentMenu) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前父级菜单不存在，请调整后重新添加')
    }
    const menu = await this.menuManager.transaction(async (transactionalEntityManager) => {
      const menuResult = await transactionalEntityManager.save<MenuEntity>(plainToInstance(MenuEntity, dto))
      await transactionalEntityManager.save<MenuPermEntity>(
        plainToInstance(
          MenuPermEntity,
          dto.menuPermList.map((perm) => {
            return { menuId: menuResult.id, ...perm }
          }),
        ),
      )
      return menuResult
    })
    if (!menu) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '菜单创建失败，请稍后重试')
    return ResultData.ok()
  }

  async findAllMenu(hasBtn: boolean): Promise<ResultData> {
    const where = { ...(!hasBtn ? { type: In([1, 2]) } : null) }
    const menuList = await this.menuRepo.find({ where, order: { orderNum: 'DESC', id: 'ASC' } })
    return ResultData.ok(menuList)
  }

  async findBtnByParentId(parentId: string): Promise<ResultData> {
    const btnList = await this.menuRepo.find({ where: { parentId }, order: { orderNum: 'DESC', id: 'DESC' } })
    return ResultData.ok(btnList)
  }

  async findMenuPerms(menuId: string): Promise<ResultData> {
    const menuPerms = await this.menuPermRepo.find({ where: { menuId } })
    return ResultData.ok(menuPerms)
  }

  async deleteMenu(id: string): Promise<ResultData> {
    const existing = await this.menuRepo.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已删除')
    const { affected } = await this.menuManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(MenuPermEntity, { menuId: id })
      const result = await transactionalEntityManager.delete<MenuEntity>(MenuEntity, id)
      return result
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '菜单删除失败，请稍后重试')
    await this.permService.clearUserInfoCache()
    return ResultData.ok()
  }

  async updateMenu(dto: UpdateMenuDto): Promise<ResultData> {
    const existing = await this.menuRepo.findOne({ where: { id: dto.id } })
    if (!existing) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已删除')
    const { affected } = await this.menuManager.transaction(async (transactionalEntityManager) => {
      // 删除原有接口权限权限
      await this.menuPermRepo.delete({ menuId: dto.id })
      // 新的接口权限入库
      const menuPermDto = plainToInstance(
        MenuPermEntity,
        dto.menuPermList.map((v) => ({ menuId: dto.id, ...v })),
      )
      await transactionalEntityManager.save<MenuPermEntity>(menuPermDto)
      delete dto.menuPermList
      // excludeExtraneousValues true  排除无关属性。 但需要在实体类中 将属性使用 @Expose()
      return await transactionalEntityManager.update<MenuEntity>(MenuEntity, dto.id, plainToInstance(MenuEntity, dto))
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前菜单更新失败，请稍后重试')
    // 清除用户权限缓存
    await this.permService.clearUserInfoCache()
    return ResultData.ok()
  }
}
