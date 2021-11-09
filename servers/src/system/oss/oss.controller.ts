import { Controller, Get, Post, UploadedFile, UseInterceptors, Query } from '@nestjs/common'
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'

import { ResultData } from '../../common/utils/result'
import { ReqListQuery } from '../../common/utils/req-list-query'

import { OssService } from "./oss.service"

@ApiTags('文件存储相关')
@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @ApiOperation({ summary: '文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile (@UploadedFile() file: Express.Multer.File): Promise<ResultData> {
    return await this.ossService.create([file])
  }

  @Get('list')
  @ApiOperation({ summary: '查询文件上传列表' })
  async findList (@Query() pager: ReqListQuery) {
    return await this.ossService.findList(pager)
  }

}
