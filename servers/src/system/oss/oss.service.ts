import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance, instanceToPlain } from 'class-transformer'
import { Between, getManager, Repository } from 'typeorm'
import * as fs from 'fs'
import * as uuid from 'uuid'
import path from 'path'
import mime from 'mime-types'

import { ResultData } from '../../common/utils/result'
import { AppHttpCode } from '../../common/enums/code.enum'

import { OssEntity } from './oss.entity'
import { FindOssDto } from './dto/find-oss.dto'

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

  async create (files: Express.Multer.File[], business: string, user: { id: string, account: string }): Promise<ResultData> {
    const ossList = files.map(file => {
      // 重新命名文件， uuid, 根据 mimeType 决定 文件扩展名， 直接拿后缀名不可靠
      const newFileName = `${uuid.v4().replace(/-/g, '')}.${mime.extension(file.mimetype)}`
      // const newFileName = `${uuid.v4().replace(/-/g, '')}.${file.originalname.split('.').pop().toLowerCase()}`
      // 文件存储路径
      const fileLocation = path.normalize(this.isAbsPath ? `${this.config.get<string>('file.location')}/${newFileName}` : path.join(this.productLocation, `${this.config.get<string>('app.file.location')}`, newFileName))
      // fs 创建文件写入流
      const writeFile = fs.createWriteStream(fileLocation)
      // 写入文件
      writeFile.write(file.buffer)
      // 千万别忘记了 关闭流
      writeFile.close()
      const ossFile = {
        url: `${this.config.get<string>('app.file.domain')}${this.config.get<string>('app.file.serveRoot') || ''}/${newFileName}`,
        size: file.size,
        type: file.mimetype,
        location: fileLocation,
        business: business || '',
        userId: user.id,
        userAccount: user.account
      }
      return plainToInstance(OssEntity, ossFile)
    })
    const result = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<OssEntity>(ossList)
    })
    if(!result) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '文件存储失败，请稍后重新上传')
    }
    return ResultData.ok(instanceToPlain(result))
  }

  async findList (search: FindOssDto): Promise<ResultData> {
    const { size, page, startDay, endDay } = search
    const where = startDay && endDay ? { createDate: Between(`${startDay} 00:00:00`, `${endDay} 23:59:59`) } : {}
    const res = await this.ossRepo.findAndCount({ order: { id: 'DESC' }, skip: size * (page - 1), take: size, where })
    return ResultData.ok({ list: instanceToPlain(res[0]), total: res[1] })
  }
}
