import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('sys_role')
export class RoleEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ description: '角色名称' })
  @Column({ type: 'varchar', length: 100, comment: '角色名称' })
  name: string

  @ApiProperty({ description: '角色备注' })
  @Column({ type: 'varchar', length: 100, default: '', comment: '角色备注' })
  remark: string

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'update_date', comment: '更新时间' })
  updateDate: Date
}
