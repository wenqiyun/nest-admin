import { Injectable, HttpException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { DeptEntity } from './dept.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ResponseData } from 'src/commin/interfaces/result.interface'
import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepository: Repository<DeptEntity>,
  ) {}

  // 查询所有部门
  async findList(): Promise<ResponseData> {
    const result = await this.deptRepository.find({
      where: { delFlag: true },
      order: {
        orderNum: 'DESC',
        deptId: 'ASC',
        name: 'ASC',
      },
    })
    return { statusCode: 200, message: '查询部门成功', data: result }
  }

  // 添加公司或部门
  async create(dto: CreateDeptDto): Promise<ResponseData> {
    const result = await this.deptRepository.save(dto)
    return { statusCode: 200, message: '添加部门成功', data: result }
  }

  // 更新部门信息
  async update(dto: UpdateDeptDto): Promise<ResponseData> {
    const existing = await this.deptRepository.findOne(dto.deptId)
    if (!existing) throw new HttpException(`更新失败，ID 为 ${dto.deptId} 的部门不存在或已删除`, 404)
    const result = await this.deptRepository.update(dto.deptId, dto)
    return { statusCode: 200, message: '部门信息修改成功', data: result }
  }

  // 删除部门
  async delete(deptId: number): Promise<ResponseData> {
    const result = await this.deptRepository.update(deptId, { delFlag: false })
    return { statusCode: 200, message: '', data: result }
  }
}
