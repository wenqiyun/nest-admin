FROM node:16.13.1

WORKDIR /servers

COPY . .

ENV TZ=Asia/Shanghai

RUN npm i && npm run build

EXPOSE 8080
