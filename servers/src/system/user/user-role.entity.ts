import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sys_user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id', comment: '用户id' })
  userId: number

  @Column({ name: 'role_id', comment: '角色id' })
  roleId: number
}
