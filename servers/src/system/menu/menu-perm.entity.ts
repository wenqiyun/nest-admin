import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('sys_menu_perm')
export class MenuPermEntity {
  @ApiProperty({ description: 'id'})
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string

  @ApiProperty({ description: '菜单id'})
  @Column({ type: 'bigint', name: 'menu_id', comment: '菜单id' })
  public menuId: string

  @ApiProperty({ description: 'api 路径'})
  @Column({ name: 'api_url', comment: '该菜单所能调用的 api 接口，必须是本应用的接口，否则设置了也不生效' })
  public apiUrl: string

  @ApiProperty({ description: 'api 方法'})
  @Column({ name: 'api_method', comment: '该菜单所能调用 api 接口的 method 方法' })
  public apiMethod: string
}
