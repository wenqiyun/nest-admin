import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'

export default () => {
  return yaml.load(readFileSync(join(__dirname, './config.yml'), 'utf8')) as Record<string, any>
}
