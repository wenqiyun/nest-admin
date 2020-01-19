import { Injectable } from '@nestjs/common'
import { Repository, LessThan } from 'typeorm'
import { MenuEntity } from './menu.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ResponseData } from '../../commin/interfaces/result.interface'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { RoleMenuEntity } from '../relationalEntities/roleMenu/roleMenu.entity'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(RoleMenuEntity)
    private readonly roleMenuRepository: Repository<RoleMenuEntity>,
  ) {}

  // 查询所有菜单 不包含按钮
  async findMenuList(type: number): Promise<ResponseData> {
    const where = type ? { type: LessThan(type) } : {}
    const result = await this.menuRepository.find({
      where,
      order: {
        orderNum: 'DESC',
        menuId: 'DESC',
        name: 'ASC',
      },
    })
    return { statusCode: 200, message: '查询菜单成功', data: result }
  }

  // 查询菜单下的按钮集合
  async findBtnList(menuId): Promise<ResponseData> {
    const result = await this.menuRepository.find({
      where: {
        parentId: menuId,
        type: 3,
      },
      order: {
        orderNum: 'DESC',
        menuId: 'DESC',
        name: 'ASC',
      },
    })
    return { statusCode: 200, message: '查询成功', data: result }
  }

  // 查询菜单详情
  async findOne(menuId: number): Promise<ResponseData> {
    const result = await this.menuRepository.findOne({ menuId })
    return { statusCode: 200, message: '查询成功', data: result }
  }

  // 创建菜单
  async create(dto: CreateMenuDto): Promise<ResponseData> {
    const result = await this.menuRepository.save(dto)
    return { statusCode: 200, message: '添加成功', data: result }
  }

  // 更新菜单信息
  async update(dto: UpdateMenuDto): Promise<ResponseData> {
    const result = await this.menuRepository.update(dto.menuId, dto)
    return { statusCode: 200, message: '更新成功', data: result }
  }

  // 删除菜单, 删除菜单之前将角色与菜单关系删除
  async delete(menuId: number): Promise<ResponseData> {
    await this.roleMenuRepository.delete({ menuId })
    const result = await this.menuRepository.delete(menuId)
    return { statusCode: 200, message: '删除成功', data: result }
  }
}
