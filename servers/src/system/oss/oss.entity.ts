import { PrimaryGeneratedColumn, CreateDateColumn, Column, Entity } from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity('sys_oss')
export class OssEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ type: 'varchar', comment: '图片等url链接' })
  public url: string

  @Column({ type: 'varchar', name: 'old_name', length: 100, comment: '原文件名称' })
  public oldName: string

  @Column({ type: 'int', comment: '文件大小 size' })
  public size: number

  @Column({ type: 'varchar', length: 20, comment: '文件 mimetype 类型' })
  public type: string

  @Exclude({ toPlainOnly: true }) // 输出屏蔽
  @Column({ type: 'varchar', length: 100, comment: '文件存放位置，暂存本地服务器，不采用云 oss' })
  public location: string

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date
}
