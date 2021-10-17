import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sys_role_menu')
export class RoleMenuEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'role_id', comment: '角色 id' })
  roleId: number

  @Column({ name: 'menu_id', comment: '菜单 id' })
  menuId: number
}
