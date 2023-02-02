import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'

const configFileNameObj = {
  development :'dev',
  test: 'test',
  production: 'prod',
  docker: 'docker'
}

const env = process.env.NODE_ENV



export default () => {
  return yaml.load(readFileSync(join(__dirname, `./${configFileNameObj[env]}.yml`), 'utf8')) as Record<string, any>
}
