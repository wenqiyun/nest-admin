import mysql from './mysql'
import jwt from './jwt'
import uploadConfig from './upload'
import redisConfig from './redis'
const appConfig = [mysql, redisConfig, jwt, uploadConfig]

export default appConfig
