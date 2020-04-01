import { Injectable } from '@nestjs/common'
import { Repository, Like } from 'typeorm'
import { OssEntity } from './oss.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ResponseData } from 'src/common/interfaces/result.interface'
import { CreateOssDto } from './dto/create-oss.dto'
import * as fs from 'fs'
import { ConfigService } from '@nestjs/config'
import { classToPlain } from 'class-transformer'

@Injectable()
export class OssService {
  constructor(
    @InjectRepository(OssEntity)
    private readonly ossRepository: Repository<OssEntity>,
    private readonly config: ConfigService,
  ) {}
  // 将上传文件的信息入库
  async create(files): Promise<ResponseData> {
    const ossList = files.map(file => {
      // 重命名， multer 上传的文件没有后缀名，在这重命名加上后缀名
      const originalnameArr = file.originalname.split('.')
      fs.renameSync(file.path, `${file.path}.${originalnameArr[originalnameArr.length - 1]}`)
      const url = `${this.config.get('upload.www')}/${file.filename}.${originalnameArr[originalnameArr.length - 1]}`
      return new CreateOssDto(url, file.mimetype, `${file.path}.${originalnameArr[originalnameArr.length - 1]}`, file.size, file.originalname)
    })
    const result = await this.ossRepository.save(ossList)
    if (!result) return { statusCode: 200, message: '上传失败' }
    const data = result.map(v => v.url)
    return { statusCode: 200, message: '上传成功', data: files.length > 1 ? data : data[0] }
  }

  // // 删除文件并删除库
  async delete(id: number): Promise<ResponseData> {
    const file = await this.ossRepository.findOne(id)
    try {
      fs.unlinkSync(file['location'])
    } catch (error) {
      return { statusCode: 500, message: '删除失败' }
    }
    // 删除文件
    const result = await this.ossRepository.delete({ id })
    if (!result) return { statusCode: 500, message: '删除失败' }
    return { statusCode: 200, message: '删除成功' }
  }

  async findList(pageSize: number, pageNum: number, oldName: string): Promise<ResponseData> {
    const where = oldName ? { oldName: Like(`%${oldName}%`) } : {}
    const files = await this.ossRepository
      .createQueryBuilder('oss')
      .where(where)
      .orderBy({
        'oss.id': 'DESC',
        'oss.create_date': 'DESC'
      })
      .skip(pageSize * (pageNum - 1))
      .take(pageSize)
      .getManyAndCount()
    return { statusCode: 200, message: '查询成功', data: { list: classToPlain(files[0]), total: files[1] } }
  }
}
