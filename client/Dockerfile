# 构建项目
FROM node:16.13.1

WORKDIR /client

COPY . .

RUN npm i && npm run build


# 构建容器
FROM nginx:stable

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=0 /client/dist /usr/share/nginx/html

EXPOSE 9540

ENV TZ=Asia/Shanghai
