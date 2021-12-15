import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sys_role_menu')
export class RoleMenuEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ type: 'bigint', name: 'role_id', comment: '角色 id' })
  roleId: string

  @Column({ type: 'bigint', name: 'menu_id', comment: '菜单 id' })
  menuId: string
}
