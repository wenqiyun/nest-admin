import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { UserRoleEntity } from '../relationalEntities/userRole/userRole.entity'
import { RoleMenuEntity } from '../relationalEntities/roleMenu/roleMenu.entity'

@Entity('sys_role')
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  public roleId: number

  @Column({ type: 'varchar', name: 'role_name', length: 100, comment: '角色名称' })
  public roleName: string

  @Column({ type: 'varchar', length: 100, comment: '角色备注' })
  public remark: string

  @Column({ type: 'int', name: 'dept_id', comment: '关联部门ID', default: null })
  public deptId: number

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date

  @OneToMany(
    type => UserRoleEntity,
    userRole => userRole.roles,
  )
  public userRoles: UserRoleEntity[]

  @OneToMany(
    type => RoleMenuEntity,
    roleMenus => roleMenus.role,
    { cascade: ['insert', 'remove'], nullable: false },
  )
  public roleMenus!: RoleMenuEntity[]
}
