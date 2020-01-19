/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80016
 Source Host           : localhost:3306
 Source Schema         : kapok

 Target Server Type    : MySQL
 Target Server Version : 80016
 File Encoding         : 65001

 Date: 18/01/2020 15:40:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `dept_id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `del_flag` tinyint(4) NOT NULL DEFAULT 1,
  `order_num` int(11) NOT NULL COMMENT '排序',
  PRIMARY KEY (`dept_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '部门管理' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (6, 0, 'kapok集团公司', 1, 1);
INSERT INTO `sys_dept` VALUES (7, 6, '长沙分公司', 1, 1);
INSERT INTO `sys_dept` VALUES (8, 6, '杭州分公司', 1, 2);
INSERT INTO `sys_dept` VALUES (9, 7, '数据部', 0, 1);
INSERT INTO `sys_dept` VALUES (10, 7, '数据部', 1, 1);
INSERT INTO `sys_dept` VALUES (11, 8, '技术部', 1, 1);

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `type` int(11) NOT NULL COMMENT '菜单类型： 1. 菜单/目录 2 tabs 3 按钮',
  `order_num` int(11) NOT NULL COMMENT '排序',
  `perms` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '权限标识，接口标识',
  `code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单标识，前端路由name',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '菜单管理' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, '首页', 1, 10, '', 'dashboard');
INSERT INTO `sys_menu` VALUES (2, 0, '权限管理', 1, 2, '', 'permission');
INSERT INTO `sys_menu` VALUES (3, 2, '用户管理', 1, 3, 'sys_user:list,,sys_role:all,sys_dept:list', 'permission_users');
INSERT INTO `sys_menu` VALUES (4, 2, '部门管理', 1, 2, 'sys_dept:list,sys_user:list', 'permission_depts');
INSERT INTO `sys_menu` VALUES (41, 4, '编辑', 3, 1, 'sys_dept:update', 'permission_depts:edit');
INSERT INTO `sys_menu` VALUES (42, 4, '删除', 3, 1, 'sys_dept:delete', 'permission_depts:del');
INSERT INTO `sys_menu` VALUES (43, 4, '添加', 3, 1, 'sys_dept:create', 'permission_depts:create');
INSERT INTO `sys_menu` VALUES (44, 2, '角色管理', 1, 1, 'sys_role:list,sys_user:list', 'permission_roles');
INSERT INTO `sys_menu` VALUES (45, 44, '添加', 3, 1, 'sys_user:roleList,sys_role:create', 'permission_roles:create');
INSERT INTO `sys_menu` VALUES (46, 44, '编辑', 3, 1, 'sys_role:update', 'permission_roles:edit');
INSERT INTO `sys_menu` VALUES (47, 44, '删除', 3, 1, 'sys_role:delete', 'permission_roles:del');
INSERT INTO `sys_menu` VALUES (48, 44, '添加用户', 3, 1, 'sys_user:createRole', 'permission_roles:addUser');
INSERT INTO `sys_menu` VALUES (49, 44, '取消关联', 3, 1, 'sys_user:updateRole', 'permission_roles:delUser');
INSERT INTO `sys_menu` VALUES (50, 0, '系统设置', 1, 1, '', 'system');
INSERT INTO `sys_menu` VALUES (51, 50, '菜单管理', 1, 2, 'sys_menu:list', 'system_menu');
INSERT INTO `sys_menu` VALUES (52, 51, '编辑', 3, 1, 'sys_menu:update', 'system_menu:edit');
INSERT INTO `sys_menu` VALUES (53, 51, '删除', 3, 1, 'sys_menu:delete', 'system_menu:del');
INSERT INTO `sys_menu` VALUES (54, 51, '添加', 3, 1, 'sys_menu:create', 'system_menu:create');
INSERT INTO `sys_menu` VALUES (55, 3, '编辑', 3, 1, 'sys_user:update,sys_role:all,sys_dept:list', 'permission_users:edit');
INSERT INTO `sys_menu` VALUES (56, 3, '禁用/启用', 3, 1, 'sys_user:updateStatus', 'permission_users:updateStatus');
INSERT INTO `sys_menu` VALUES (57, 50, '文件上传', 1, 1, 'sys_oss:list', 'system_oss');
INSERT INTO `sys_menu` VALUES (58, 57, '删除', 3, 1, 'sys_oss:delete', 'system_oss:del');

-- ----------------------------
-- Table structure for sys_oss
-- ----------------------------
DROP TABLE IF EXISTS `sys_oss`;
CREATE TABLE `sys_oss`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片等url链接',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件存放位置，暂存本地服务器，不采用云 oss',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件类型',
  `size` int(11) NOT NULL COMMENT '文件大小 size',
  `old_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '原文件名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_oss
-- ----------------------------
INSERT INTO `sys_oss` VALUES (1, 'http://localhost:8080/59f38c077c758158297d70061431429b.jpg', 'D:\\programWork\\kapok\\kapok-blog\\upload\\59f38c077c758158297d70061431429b.jpg', '2020-01-16 16:46:28.893953', 'image/jpeg', 134849, '2-2.jpg');
INSERT INTO `sys_oss` VALUES (2, 'http://localhost:8080/b37f8d762222ffbf280fa708b4b57f4a.jpg', 'D:\\programWork\\kapok\\kapok-blog\\upload\\b37f8d762222ffbf280fa708b4b57f4a.jpg', '2020-01-16 17:21:47.423349', 'image/jpeg', 208979, '20.3(2)(1).jpg');
INSERT INTO `sys_oss` VALUES (3, 'http://localhost:8080/dcc5c2e041ff3a77ef4da08d4c7b0407.jpg', 'D:\\programWork\\kapok\\kapok-blog\\upload\\dcc5c2e041ff3a77ef4da08d4c7b0407.jpg', '2020-01-16 19:21:19.272530', 'image/jpeg', 132473, 'photo-3.jpg');
INSERT INTO `sys_oss` VALUES (4, 'http://localhost:8080/1d7b580b8be90b19c76bdc3f9c9ad88d.jpg', 'D:\\programWork\\kapok\\kapok-blog\\upload\\1d7b580b8be90b19c76bdc3f9c9ad88d.jpg', '2020-01-18 09:26:03.289445', 'image/jpeg', 108859, 'photo-4.jpg');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `remark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色备注',
  `role_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `dept_id` int(11) NULL DEFAULT NULL COMMENT '关联部门ID',
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (11, '测试角色权限', '测试角色', NULL, '2020-01-09 18:10:15.915803');
INSERT INTO `sys_role` VALUES (12, '拥有所有角色', '超管', NULL, '2020-01-10 15:45:16.543450');

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NULL DEFAULT NULL COMMENT '角色ID',
  `dept_id` int(11) NULL DEFAULT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色与部门对应关系' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_b65fa84413c357d7282153b4a88`(`role_id`) USING BTREE,
  INDEX `FK_543ffcaa38d767909d9022f2522`(`menu_id`) USING BTREE,
  CONSTRAINT `FK_543ffcaa38d767909d9022f2522` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`menu_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_b65fa84413c357d7282153b4a88` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 104 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色与菜单对应关系' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (14, 12, 1);
INSERT INTO `sys_role_menu` VALUES (15, 12, 2);
INSERT INTO `sys_role_menu` VALUES (16, 12, 3);
INSERT INTO `sys_role_menu` VALUES (17, 12, 4);
INSERT INTO `sys_role_menu` VALUES (18, 12, 42);
INSERT INTO `sys_role_menu` VALUES (19, 12, 41);
INSERT INTO `sys_role_menu` VALUES (104, 11, 2);
INSERT INTO `sys_role_menu` VALUES (105, 11, 3);
INSERT INTO `sys_role_menu` VALUES (106, 11, 56);
INSERT INTO `sys_role_menu` VALUES (107, 11, 55);
INSERT INTO `sys_role_menu` VALUES (108, 11, 4);
INSERT INTO `sys_role_menu` VALUES (109, 11, 43);
INSERT INTO `sys_role_menu` VALUES (110, 11, 42);
INSERT INTO `sys_role_menu` VALUES (111, 11, 41);
INSERT INTO `sys_role_menu` VALUES (112, 11, 44);
INSERT INTO `sys_role_menu` VALUES (113, 11, 49);
INSERT INTO `sys_role_menu` VALUES (114, 11, 48);
INSERT INTO `sys_role_menu` VALUES (115, 11, 47);
INSERT INTO `sys_role_menu` VALUES (116, 11, 46);
INSERT INTO `sys_role_menu` VALUES (117, 11, 45);
INSERT INTO `sys_role_menu` VALUES (118, 11, 50);
INSERT INTO `sys_role_menu` VALUES (119, 11, 51);
INSERT INTO `sys_role_menu` VALUES (120, 11, 54);
INSERT INTO `sys_role_menu` VALUES (121, 11, 53);
INSERT INTO `sys_role_menu` VALUES (122, 11, 52);
INSERT INTO `sys_role_menu` VALUES (123, 11, 57);
INSERT INTO `sys_role_menu` VALUES (124, 11, 58);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户登录密码',
  `account` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户登录账号',
  `nickname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户显示昵称',
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱地址',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '所属状态是否有效',
  `avatar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '头像地址',
  `dept_id` int(11) NOT NULL,
  `create_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `phoneNum` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户手机号码',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_96bde34263e2ae3b46f011124a`(`dept_id`) USING BTREE,
  CONSTRAINT `FK_96bde34263e2ae3b46f011124ac` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`dept_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'f817616c72c4c781dc7f9d7eb20b930b1668303c007a41e2e6731aea41531619', 'kapok', 'kapok', '145605@qq.com', 1, 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80', 7, '2019-12-26 09:10:09.464241', '2019-12-26 09:10:09.910659', '18374925852');
INSERT INTO `sys_user` VALUES (2, 'f817616c72c4c781dc7f9d7eb20b930b1668303c007a41e2e6731aea41531619', 'kapok1', 'kapok1', '192652@qq.com', 0, 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80', 8, '2019-12-26 17:39:48.324599', '2020-01-17 12:57:08.000000', '18374962585');
INSERT INTO `sys_user` VALUES (4, '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', '管理员', '123456@qq.com', 1, 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80', 11, '2020-01-18 15:38:37.082113', '2020-01-18 15:38:37.082113', '18312345678');
INSERT INTO `sys_user` VALUES (5, '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'test', '测试', '1234567@qq.com', 1, 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80', 10, '2020-01-18 15:39:23.909195', '2020-01-18 15:39:23.909195', '18212345678');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_71b4edf9aedbd3e5707156e80a2`(`user_id`) USING BTREE,
  INDEX `FK_e8300bfcf561ed417f5f02c6776`(`role_id`) USING BTREE,
  CONSTRAINT `FK_71b4edf9aedbd3e5707156e80a2` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_e8300bfcf561ed417f5f02c6776` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户与角色对应关系' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (5, 1, 11);

SET FOREIGN_KEY_CHECKS = 1;
