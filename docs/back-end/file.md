#### 文件上传
```
npm i -D @types/multer
```

service

```javascript
import * as fs from 'fs'
import * as uuid from 'uuid'
import path from 'path'
import mime from 'mime-types'

export class OssService {
  private readonly productLocation = process.cwd()
  private isAbsPath = false

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(OssEntity)
    private readonly ossRepo: Repository<OssEntity>
  ) {
    // 判断 src/config 配置文件中 配置的存储路径是相对路径还是绝对路径
    this.isAbsPath = path.isAbsolute(this.config.get<string>('app.file.location'))
  }

  async create (files: Express.Multer.File[], business: string, user: { id: string, account: string }): Promise<ResultData> {
    const ossList = files.map(file => {
      // 重新命名文件， uuid, 根据 mimeType 决定 文件扩展名， 直接拿后缀名不可靠
      const newFileName = `${uuid.v4().replace(/-/g, '')}.${mime.extension(file.mimetype)}`
      // const newFileName = `${uuid.v4().replace(/-/g, '')}.${file.originalname.split('.').pop().toLowerCase()}`
      // 文件存储路径
      const fileLocation = path.normalize(
        this.isAbsPath ?
        `${this.config.get<string>('file.location')}/${newFileName}` :
        path.join(this.productLocation, `${this.config.get<string>('app.file.location')}`, newFileName))
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
      return plainToClass(OssEntity, ossFile)
    })
    const result = await getManager().transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<OssEntity>(ossList)
    })
    if(!result) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '文件存储失败，请稍后重新上传')
    }
    return ResultData.ok(classToPlain(result))
  }
}
```

> [!WARNING]
> 切记：创建 流，一定要业务逻辑处理完关闭！！！

controller

```javascript
@Post('upload')
@ApiOperation({ summary: '文件上传,返回 url 地址' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        description: '文件',
        type: 'string',
        format: 'binary',
      },
      business: {
        description: '上传文件描述，可以是纯字符串，也可以是JSON字符串',
        type: 'string',
        format: 'text',
      }
    },
  },
})
@HttpCode(200)
@UseInterceptors(FileInterceptor('file'))
async uploadFile (@UploadedFile() file: Express.Multer.File, @Body() params: { business: string }, @Req() req): Promise<ResultData> {
  return await this.ossService.create([file], params.business || '', req.user)
}
```

> [!TIP]
> 本文档介绍的是文件上传存储到本地，如果有上传文件到阿里云 OSS、七牛云等的需求请您自己查找相关资料，这里就不展开了。

