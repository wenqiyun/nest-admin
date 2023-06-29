#!/bin/sh

. /etc/profile
. ~/.bash_profile

# 这个脚本，是为了每日重新初始化启动演示项目

# 打开工作目录
cd /root/nest-admin

# 关闭所有服务，并销毁卷积，方便初始化数据库
docker compose -f "docker-compose.yaml" down --volumes

# 拉代码
git pull

# 构建前端
cd client
pnpm i
pnpm run build-only

# 切换回工作目录
cd ..

# 启动所有服务
docker compose -f "docker-compose.yaml" up -d --build
