import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from 'typeorm';
import { DeptEntity } from "./dept.entity";
import { CreateDeptDto } from './dto/create-dept.dto';
import { ResultData } from '../../common/utils/result';
import { plainToInstance } from "class-transformer";
import { AppHttpCode } from '../../common/enums/code.enum';
import { UpdateDeptDto } from './dto/update-dept.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepo: Repository<DeptEntity>,
    @InjectEntityManager()
    private readonly deptManager: EntityManager
  ) {}


  /** 创建部门 */
  async create (dto: CreateDeptDto): Promise<ResultData> {
    // 查询父部门是否存在
    if (dto.parentId !== '0') {
      const existing = await this.deptRepo.findOne({ where: { parentId: dto.parentId } })
      if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '上级部门不存在或已被删除，请修改后重新添加')
    }
    const dept = plainToInstance(DeptEntity, dto)
    const res = await this.deptManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<DeptEntity>(dept)
    })
    if (!res) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试')
    return ResultData.ok(res)
  }

  /** 更新部门 */
  async update (dto: UpdateDeptDto): Promise<ResultData> {
    const existing = await this.deptRepo.findOne({ where: { id: dto.id } })
    if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '部门不存在或已被删除，请修改后重新添加')
    const { affected } = await this.deptManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.update<DeptEntity>(DeptEntity, dto.id, dto)
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '更新失败，请稍后尝试')
    return ResultData.ok()
  }

  /** 删除部门 */
  async delete (id: string): Promise<ResultData> {
    const existing = await this.deptRepo.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '部门不存在或已被删除')
    const { affected } = await this.deptManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete<DeptEntity>(DeptEntity, { parentId: id })
      return await transactionalEntityManager.delete<DeptEntity>(DeptEntity, id)
    })
    if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除部门失败，请稍后尝试')
    return ResultData.ok()
  }

  /** 查询所有部门 */
  async find (): Promise<ResultData> {
    const depts = await this.deptRepo.find()
    return ResultData.ok(depts)
  }

}
