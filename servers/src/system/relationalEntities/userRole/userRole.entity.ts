import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm'
import { UserEntity } from '../../user/user.entity'
import { RoleEntity } from '../../roles/role.entity'

@Entity('sys_user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId!: number

  @Column({ name: 'role_id' })
  roleId!: number

  @ManyToOne(
    type => UserEntity,
    user => user.userRoles,
  )
  @JoinColumn({ name: 'user_id' })
  users!: UserEntity

  @ManyToOne(
    type => RoleEntity,
    role => role.userRoles,
  )
  @JoinColumn({ name: 'role_id' })
  roles!: RoleEntity
}
