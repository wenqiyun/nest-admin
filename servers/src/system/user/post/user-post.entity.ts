import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'

@Entity('sys_user_post')
export class UserPostEntity  {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ type: 'bigint', name: 'user_id', comment: '用户id' })
  userId: string

  @Column({ type: 'bigint', name: 'post_id', comment: '岗位id'})
  postId: string
}
