import { Controller, Post, Body, Delete, Get, Put, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { ApiResult } from '../../common/decorators/api-result.decorator'
import { ResultData } from '../../common/utils/result'

import { PostEntity } from './post.entity'
import { PostService } from './post.service'

import { FindPostListDto } from './dto/findPostList.dto'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@ApiTags('岗位模块')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: '创建岗位' })
  @ApiResult(PostEntity)
  async create(@Body() dto: CreatePostDto): Promise<ResultData> {
    return this.postService.create(dto)
  }

  @Put()
  @ApiOperation({ summary: '岗位更新' })
  @ApiResult()
  async update(@Body() dto: UpdatePostDto): Promise<ResultData> {
    return this.postService.update(dto)
  }

  @Get('list')
  @ApiOperation({ summary: '查询岗位列表' })
  @ApiResult(PostEntity, true)
  async find(@Query() dto: FindPostListDto): Promise<ResultData> {
    return this.postService.findList(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询岗位详情' })
  @ApiResult(PostEntity)
  async findOne(@Param('id') id: string): Promise<ResultData> {
    return this.postService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除岗位' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return this.postService.delete(id)
  }
}
