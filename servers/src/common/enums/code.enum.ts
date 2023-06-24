export enum AppHttpCode {
  /** 公共错误 */
  /** 服务器出错 */
  SERVICE_ERROR = 500500,
  /** 数据为空 */
  DATA_IS_EMPTY = 100001,
  /** 参数有误 */
  PARAM_INVALID = 100002,
  /** 文件类型错误 */
  FILE_TYPE_ERROR = 100003,
  /** 文件超出大小 */
  FILE_SIZE_EXCEED_LIMIT = 100004,
  /** 创建用户已存在，手机号，邮箱， 用户名等 */
  USER_CREATE_EXISTING = 200001,
  /** 两次密码输入不一致, 账号密码不一致等 */
  USER_PASSWORD_INVALID = 200002,
  /** 帐号被禁用 */
  USER_ACCOUNT_FORBIDDEN = 200003,
  /** 用户状态更改，当前用户 与 修改用户一致 */
  USER_FORBIDDEN_UPDATE = 20004,
  /** 用户不存在 */
  USER_NOT_FOUND = 200004,
  /** 角色未找到 */
  ROLE_NOT_FOUND = 300004,
  /** 角色不可删除 */
  ROLE_NOT_DEL = 300005,
  /** 无权限 */
  ROLE_NO_FORBIDDEN = 300403,
  /** 菜单未找到 */
  MENU_NOT_FOUND = 400004,
  /** 部门不存在 */
  DEPT_NOT_FOUND = 500004,
  /** 岗位已存在 */
  POST_REPEAT = 600001,
  /** 岗位不存在 */
  POST_NOT_FOUND = 600004,
}
