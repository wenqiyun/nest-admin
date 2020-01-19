import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { RoleMenuEntity } from '../relationalEntities/roleMenu/roleMenu.entity'

@Entity('sys_menu')
export class MenuEntity {
  @PrimaryGeneratedColumn({ name: 'menu_id' })
  public menuId: number

  @Column({ name: 'parent_id' })
  public parentId: number

  @Column({ type: 'varchar', length: 50, comment: '菜单名称' })
  public name: string

  @Column({ type: 'varchar', comment: '权限标识，接口标识', default: null })
  public perms: string

  @Column({ type: 'varchar', length: 30, comment: '菜单标识，前端路由name,按钮唯一标识，用于菜单按钮显隐' })
  public code: string

  @Column({ type: 'int', comment: '菜单类型： 1. 菜单/目录 2 tabs 3 按钮' })
  public type: number

  @Column({ name: 'order_num', comment: '排序' })
  public orderNum: number

  @OneToMany(
    type => RoleMenuEntity,
    roleMenus => roleMenus.role,
    {
      cascade: true,
    },
  )
  public roleMenus: RoleMenuEntity[]
}
