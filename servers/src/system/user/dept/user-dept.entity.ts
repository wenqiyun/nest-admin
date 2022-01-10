import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_user_dept')
export class UserDeptEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ type: 'bigint', name: 'user_id', comment: '用户id' })
  userId: string

  @Column({ type: 'bigint', name: 'dept_id', comment: '部门id' })
  deptId: string
}
