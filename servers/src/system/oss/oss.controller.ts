import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, Get, Query, Param, Delete, HttpCode, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'

import { RolesGuard } from '../../common/guards/roles.guard'
import { Permissions } from '../../common/decorators/permissions.decorator'
import { ResponseData } from '../../common/interfaces/result.interface'

import { OssService } from './oss.service'
import { JwtAuthGuard } from '../auth/auth.guard'

@ApiBearerAuth()
@ApiTags('文件管理')
@Controller('oss')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post('upload')
  @HttpCode(200)
  @ApiOperation({ summary: '文件上传，接收 multipart/form-data 的数据' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file): Promise<ResponseData>  {
    return this.ossService.create([file])
  }

  @Post('upload/mult')
  @HttpCode(200)
  @ApiOperation({ summary: '文件上传，接收 multipart/form-data 的数据' })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files): Promise<ResponseData> {
    return this.ossService.create(files)
  }

  @Get('list')
  @ApiOperation({ summary: '查询文件列表' })
  @Permissions('sys_oss:list')
  async findList(@Query() query): Promise<ResponseData>  {
    return this.ossService.findList(query.pageSize || 10, query.pageNum || 1, query.oldName || null)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  @Permissions('sys_oss:delete')
  async deleteFile(@Param('id') id: number): Promise<ResponseData>  {
    return this.ossService.delete(id)
  }
}
