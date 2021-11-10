import { HttpStatus, Injectable } from '@nestjs/common'
import { getManager, Repository, In } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'

import { ResultData } from '../../common/utils/result'

import { MenuEntity } from './menu.entity'
import { MenuPermEntity } from './menu-perm.entity'
import { CreateMenuDto } from './dto/create-menu.dto'

import { UpdateMenuPermDto } from './dto/update-menu-perm.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepo: Repository<MenuEntity>,
    @InjectRepository(MenuPermEntity)
    private readonly menuPermRepo: Repository<MenuPermEntity>,
  ) {}

  async create(dto: CreateMenuDto): Promise<ResultData> {
    console.log(dto, 8890)
    if (dto.parentId !== 0) {
      // 查询当前父级菜单是否存在
      const parentMenu = await this.menuRepo.findOne({ id: dto.parentId })
      if (!parentMenu) return ResultData.fail(HttpStatus.NOT_FOUND, '当前父级菜单不存在，请调整后重新添加')
    }
    const menu = await getManager().transaction(async (transactionalEntityManager) => {
      const menu = await transactionalEntityManager.save<MenuEntity>(plainToClass(MenuEntity, dto))
      await transactionalEntityManager.save<MenuPermEntity>(
        plainToClass(
          MenuPermEntity,
          dto.menuPermList.map((perm) => {
            return { menuId: menu.id, ...perm }
          }),
        ),
      )
      return menu
    })
    if (!menu) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '菜单创建失败，请稍后重试')
    return ResultData.ok()
  }

  async findAllMenu(hasBtn: boolean): Promise<ResultData> {
    const where = { ...(!hasBtn ? { type: In([1, 2]) } : null) }
    const menuList = await this.menuRepo.find({ where })
    return ResultData.ok(menuList)
  }

  async findBtnByParentId(parentId: number): Promise<ResultData> {
    const btnList = await this.menuRepo.find({ where: { parentId } })
    return ResultData.ok(btnList)
  }

  async findMenuPerms(menuId: number): Promise<ResultData> {
    const menuPerms = await this.menuPermRepo.find({ where: { menuId } })
    return ResultData.ok(menuPerms)
  }

  async deleteMenu(id: number): Promise<ResultData> {
    const existing = await this.menuRepo.findOne({ id })
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, '当前菜单不存在或已删除')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(MenuPermEntity, { menuId: id })
      const result = await transactionalEntityManager.delete<MenuEntity>(MenuEntity, id)
      return result
    })
    if (!affected) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '菜单删除失败，请稍后重试')
    return ResultData.ok()
  }

  async updateMenu(dto: UpdateMenuDto): Promise<ResultData> {
    const existing = await this.menuRepo.findOne({ id: dto.id })
    if (!existing) return ResultData.fail(HttpStatus.NOT_FOUND, '当前菜单不存在或已删除')
    const { affected } = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<MenuEntity>(MenuEntity, dto.id, plainToClass(MenuEntity, dto))
    })
    if (!affected) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '当前菜单更新失败，请稍后重试')
    return ResultData.ok()
  }

  async updateMenuPerm(dto: UpdateMenuPermDto): Promise<ResultData> {
    const menuPerms = await getManager().transaction(async (transactionalEntityManager) => {
      await this.menuPermRepo.delete({ menuId: dto.menuId })
      const result = await transactionalEntityManager.save<MenuPermEntity>(
        plainToClass(
          MenuPermEntity,
          dto.menuPerms.map((perm) => {
            return { menuId: dto.menuId, perm }
          }),
        ),
      )
      return result
    })
    if (!menuPerms) return ResultData.fail(HttpStatus.INTERNAL_SERVER_ERROR, '菜单权限更新失败')
    return ResultData.ok(menuPerms)
  }
}
