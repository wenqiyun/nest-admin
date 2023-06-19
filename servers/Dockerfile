FROM node:16.13.1

CMD [ "mkdir", "/upload" ]

WORKDIR /servers

COPY . .

ENV TZ=Asia/Shanghai

RUN npm i --registry=https://registry.npm.taobao.org && npm run build

EXPOSE 8080
