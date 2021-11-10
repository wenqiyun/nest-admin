import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('sys_oss')
export class OssEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: number

  @Column({ type: 'varchar', comment: '文件 url' })
  public url: string

  @Column({ type: 'int', comment: '文件size' })
  public size: number

  @Column({ type: 'varchar', length: 20, comment: '文件mimetype类型' })
  public type: string



  @Column({ type: 'varchar', length: 200, comment: '文件存放位置' })
  public location: string

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date
}
