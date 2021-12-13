import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('sys_menu')
export class MenuEntity {
  @ApiProperty({ description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string

  @ApiProperty({ description: '父级菜单id' })
  @Column({ name: 'parent_id', type: 'bigint' })
  public parentId: string

  @ApiProperty({ description: '菜单名称' })
  @Column({ type: 'varchar', length: 30, comment: '菜单名称' })
  public name: string

  @ApiProperty({ description: '菜单/按钮唯一标识,有前端定义,用于控制菜单按钮显隐' })
  @Column({ type: 'varchar', length: 50, comment: '菜单/按钮唯一标识，由前端路由name,用于控制菜单按钮显隐' })
  public code: string

  @ApiProperty({ description: '菜单类型, 1-菜单 2-tabs 3-按钮' })
  @Column({ type: 'int', comment: '菜单类型， 1-菜单/目录 2-tabs 3-按钮' })
  public type: 1 | 2 | 3

  @ApiProperty({ description: '排序' })
  @Column({ name: 'order_num', type: 'int', comment: '排序', default: 0 })
  public orderNum: number
}
