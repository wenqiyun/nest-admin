import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Exclude } from 'class-transformer'

@Entity('sys_oss')
export class OssEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: number

  @Column({ type: 'bigint', name: 'user_id', comment: '上传用户id' })
  public userId: string

  @Column({ type: 'varchar',name: 'user_account', length: 32, comment: '上传用户帐号' })
  public userAccount: string

  @Column({ type: 'varchar', comment: '文件 url' })
  public url: string

  @Column({ type: 'int', comment: '文件size' })
  public size: number

  @Column({ type: 'varchar', length: 20, comment: '文件mimetype类型' })
  public type: string

  @Column({ type: 'varchar', length: 200, comment: '业务描述字段，可以字符串，也可以是 JSON 字符串' })
  public business: string

  @Exclude({ toPlainOnly: true }) // 输出屏蔽
  @Column({ type: 'varchar', length: 200, comment: '文件存放位置' })
  public location: string

  @CreateDateColumn({ type: 'timestamp', name: 'create_date', comment: '创建时间' })
  createDate: Date
}
