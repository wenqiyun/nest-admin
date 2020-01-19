import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('sys_dept')
export class DeptEntity {
  @PrimaryGeneratedColumn({ name: 'dept_id' })
  public deptId: number

  @Column({ name: 'parent_id' })
  public parentId: number

  @Column({ type: 'varchar', comment: '部门名称', length: 50 })
  public name: string

  @Column({ name: 'order_num', comment: '排序' })
  public orderNum: number

  @Column({ name: 'del_flag', default: true })
  public delFlag: boolean
}
