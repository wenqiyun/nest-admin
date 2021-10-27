import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Entity('sys_user')
export class UserEntity {
  @ApiProperty({ type: Number, description: 'id' })
  @PrimaryGeneratedColumn()
  public id: number

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column({ type: 'varchar', length: 200, nullable: false, comment: '用户登录密码' })
  public password: string

  @Exclude({ toPlainOnly: true }) // 输出屏蔽盐
  @Column({ type: 'varchar', length: 200, nullable: false, comment: '盐' })
  public salt: string

  @ApiProperty({ type: String, description: '用户登录账号' })
  @Column({ type: 'varchar', length: 32, comment: '用户登录账号' })
  public account: string

  @ApiProperty({ type: String, description: '手机号' })
  @Column({ type: 'varchar', name: 'phone_num', default: '', length: 20, comment: '用户手机号码' })
  public phoneNum: string

  @ApiProperty({ type: String, description: '邮箱' })
  @Column({ type: 'varchar', comment: '邮箱地址', default: '' })
  public email: string

  @ApiProperty({ type: String, description: '所属状态: 1-有效，0-禁用' })
  @Column({ type: 'tinyint', default: 1, comment: '所属状态: 1-有效，0-禁用' })
  public status: number

  @ApiProperty({ type: String, description: '头像url' })
  @Column({ type: 'varchar', comment: '头像地址' })
  public avatar: string

  @ApiProperty({ type: Number, description: '帐号类型：0-超管， 1-普通用户' })
  @Column({ type: 'tinyint', default: 1, comment: '帐号类型：0-超管， 1-普通用户' })
  public type: number

  @ApiProperty({ type: Date, description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({ type: 'timestamp', name: 'update_date', comment: '更新时间' })
  updateDate: Date
}
