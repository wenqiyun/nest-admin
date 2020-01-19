import { Injectable } from '@nestjs/common'
import { getConnection } from 'typeorm'

@Injectable()
export class PermService {
  /**
   *
   * select m.perms from sys_user_role ur
   * LEFT JOIN sys_role_menu rm on ur.role_id = rm.role_id
   * LEFT JOIN sys_menu m on rm.menu_id = m.menu_id
   * where ur.user_id = #{userId}
   */
  async findUserPerms(userId: number): Promise<object[]> {
    const perms = await getConnection()
      .createQueryBuilder()
      .select()
      .from('sys_user_role', 'ur')
      .leftJoinAndSelect('sys_role_menu', 'rm', 'ur.role_id = rm.role_id')
      .leftJoinAndSelect('sys_menu', 'm', 'rm.menu_id = m.menu_id')
      .where('ur.user_id =:userId', { userId })
      .getRawMany()
    // .stream()
    // console.log(perms)
    return perms
  }
}
