import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../common/enums/common.enum'

@Entity('sys_post')
export class PostEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @ApiProperty({ description: '岗位编码' })
  @Column({ type: 'varchar', length: 50, comment: '岗位编码' })
  code: string

  @ApiProperty({ description: '岗位名称' })
  @Column({ type: 'varchar', length: 50, comment: '岗位名称' })
  name: string

  @ApiProperty({ description: '状态', enum: $enum(StatusValue).getValues() })
  @Column({ type:  'tinyint', default: StatusValue.NORMAL, comment: '岗位状态，1-有效，0-禁用' })
  status: StatusValue

  @ApiProperty({ description: '备注' })
  @Column({ type: 'text',default: null, comment: '备注' })
  remark: string

  @ApiProperty({ description: '排序' })
  @Column({ name: 'order_num', type: 'int', comment: '排序', default: 0 })
  orderNum: number

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date
}
