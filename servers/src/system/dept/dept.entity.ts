import { ApiProperty } from '@nestjs/swagger'
import { PrimaryGeneratedColumn, Column, CreateDateColumn, Entity } from 'typeorm'
import { $enum } from 'ts-enum-util'

import { StatusValue } from '../../common/enums/common.enum'

@Entity('sys_dept')
export class DeptEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @ApiProperty({ description: '上级部门 id' })
  @Column({ type: 'bigint', name: 'parent_id', comment: '父级部门 id' })
  parentId: string

  @ApiProperty({ description: '部门名称' })
  @Column({ type: 'varchar', length: 50, comment: '部门名称' })
  name: string

  @ApiProperty({ description: '状态', enum: $enum(StatusValue).getValues() })
  @Column({ type: 'tinyint', default: StatusValue.NORMAL, comment: '部门状态，1-有效，0-禁用' })
  status: StatusValue

  @ApiProperty({ description: '排序' })
  @Column({ name: 'order_num', type: 'int', comment: '排序', default: 0 })
  orderNum: number

  @ApiProperty({ description: '部门负责人' })
  @Column({ type: 'varchar', length: 50, comment: '部门负责人' })
  leader: string

  @ApiProperty({ description: '备注' })
  @Column({ type: 'text', comment: '备注' })
  remark: string

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date
}
