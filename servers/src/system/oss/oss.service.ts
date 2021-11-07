import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { getManager, Repository } from 'typeorm'
import * as fs from 'fs'
import * as uuid from 'uuid'
import path from 'path'

import { ReqListQuery } from '../../common/utils/req-list-query'
import { ResultData } from '../../common/utils/result'

import { OssEntity } from './oss.entity'

@Injectable()
export class OssService {
  private readonly productLocation = process.cwd()
  private isAbsPath = false

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(OssEntity)
    private readonly ossRepo: Repository<OssEntity>
  ) {
    this.isAbsPath = path.isAbsolute(this.config.get<string>('app.file.location'))
  }

  async create (files: Express.Multer.File[]): Promise<ResultData> {
    const ossList = files.map(file => {
      // 重新命名文件， uuid
      const newFileName = `${uuid.v4().replace(/-/g, '')}.${file.originalname.split('.').pop().toLowerCase()}`
      // 文件存储路径
      const fileLocation = path.normalize(this.isAbsPath ? `${this.config.get<string>('file.location')}/${newFileName}` : path.join(this.productLocation, `${this.config.get<string>('app.file.location')}`, newFileName))
      // fs 创建文件写入流
      const writeFile = fs.createWriteStream(fileLocation)
      // 写入文件
      writeFile.write(file.buffer)
      // 千万别忘记了 关闭流
      writeFile.close()
      const ossFile = { url: `${this.config.get<string>('app.file.domain')}/${newFileName}`, size: file.size, type: file.mimetype, location: fileLocation }
      return plainToClass(OssEntity, ossFile)
    })
    const result = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<OssEntity>(ossList)
    })
    return ResultData.ok(result)
  }

  async findList (pager: ReqListQuery): Promise<ResultData> {
    const { size, page } = pager
    const res = await this.ossRepo.findAndCount({ order: { id: 'DESC' }, skip: size * (page - 1), take: size })
    return ResultData.ok({ list: res[0], total: res[1] })
  }
}
