import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sys_user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'bigint', name: 'user_id', comment: '用户id' })
  userId: number

  @Column({ type: 'bigint', name: 'role_id', comment: '角色id' })
  roleId: number
}
