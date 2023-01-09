import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, getManager, Like, EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer'

import { ResultData } from '../../common/utils/result'
import { AppHttpCode } from '../../common/enums/code.enum'

import { PostEntity } from './post.entity'

import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { FindPostListDto } from './dto/findPostList.dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectEntityManager()
    private readonly postManager: EntityManager,
  ) {}

  /** 创建岗位 */
  async create(dto: CreatePostDto): Promise<ResultData> {
    const existing = await this.postRepo.findOne({ where: { code: dto.code, name: dto.name } })
    if (existing) return ResultData.fail(AppHttpCode.POST_REPEAT, '当前岗位名称与编码已存在，请修改后重新创建')
    const post = plainToInstance(PostEntity, dto)
    const res = await this.postManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<PostEntity>(post)
    })
    if (!res) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试')
    return ResultData.ok(res)
  }

  /** 更新岗位 */
  async update(dto: UpdatePostDto): Promise<ResultData> {
    const existing = await this.postRepo.findOne({ where: { id: dto.id } })
    if (!existing) return ResultData.fail(AppHttpCode.POST_NOT_FOUND, '岗位不存在或已被删除，请修改后重新添加')
    const { affected } = await this.postManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<PostEntity>(PostEntity, dto.id, dto)
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试')
    return ResultData.ok()
  }

  /** 删除岗位 */
  async delete(id: string): Promise<ResultData> {
    const existing = await this.postRepo.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.POST_NOT_FOUND, '岗位不存在或已被删除')
    const { affected } = await this.postManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.delete<PostEntity>(PostEntity, id)
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除部门失败，请稍后尝试')
    return ResultData.ok()
  }

  /** 查询岗位 */
  async findList(dto: FindPostListDto): Promise<ResultData> {
    const { size, page, name, code, status } = dto
    const where = {
      ...(!!name ? { name: Like(`%${name}%`) } : null),
      ...(!!code ? { code: Like(`%${code}%`) } : null),
      ...(![null, undefined].includes(status) ? { status } : null),
    }
    const posts = await this.postRepo.findAndCount({ where, order: { orderNum: 'DESC', id: 'DESC', createDate: 'DESC' }, skip: size * (page - 1), take: size })
    return ResultData.ok({ list: posts[0], total: posts[1] })
  }
  /** 查询单个岗位信息 */
  async findOne(id: string): Promise<ResultData> {
    const post = await this.postRepo.findOne({ where: { id } })
    return ResultData.ok(post)
  }
}
