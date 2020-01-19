import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm'
import { RoleEntity } from '../../roles/role.entity'
import { MenuEntity } from '../../menu/menu.entity'

@Entity('sys_role_menu')
export class RoleMenuEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'role_id' })
  roleId!: number

  @Column({ name: 'menu_id' })
  menuId!: number

  // 暂时不做
  // @Column({ name: 'is_disabled', default: false, comment: '标识，是否禁用, 当用户拥有的两个角色都包含菜单角色时，则禁用为先' })
  // isDisabled: boolean

  @ManyToOne(
    type => RoleEntity,
    role => role.roleMenus,
  )
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity

  @ManyToOne(
    type => MenuEntity,
    menu => menu.roleMenus,
  )
  @JoinColumn({ name: 'menu_id' })
  menu!: MenuEntity
}
