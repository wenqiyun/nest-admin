import { ConfigService } from '@nestjs/config'
import * as util from 'util'
import { Injectable } from '@nestjs/common'
import { Logger } from './log.util'
import { Client } from 'ldapts'

@Injectable()
export class LdapUtil {
  private client: Client
  constructor(private readonly config: ConfigService) {
    this.client =  new  Client({ url: this.config.get('ldap.server'), timeout: 0, connectTimeout: 0 })
  }

  async search(username: string, password: string): Promise<any> {
    try {
      if (this.config.get('ldap.bindPassword')) {
        await this.client.bind(this.config.get('ldap.baseDN'), this.config.get('ldap.bindPassword'))
      }
      
      //
      const searchDn = this.config.get('ldap.searchDN')
      const searchStandard = this.config.get('ldap.searchStandard')
      // 处理自定义 filter
      let customFilter
      if (/^&/gi.test(searchStandard)) {
        customFilter = util.format(searchStandard, username)
      } else {
        customFilter = `${searchStandard}=${username}`
      }
      // 
      const { searchEntries } = await this.client.search(searchDn, { scope: 'sub', filter: `(${customFilter})` })
      // 处理搜索结果
      const users = []
      if (searchEntries) searchEntries.forEach(v => v && users.push(v))
      if (users.length > 0) {
        // 比较账号和密码
        const res = await this.loginUserBind(users[0].dn, password)
        if (res) {
          return { type: true, info: users[0] }
        } else {
          return { type: false, msg: '用户名或密码不正确' }
        }
      } else {
        return { type: false, msg: '用户不存在' }
      }
    } catch (error) {
      Logger.error(`[LDAP error] ${error}`)
      return { type: false, msg: '服务器出错' }
    } finally {
      await this.client.unbind()
    }
  }

  private async loginUserBind (userDn: string, password: string) {
    let result = false
    try {
      await this.client.bind(userDn, password)
      result = true
    } catch (error) {
      result = false
      Logger.error(`[ LDAP login user valid password error ]  ${error}`)
    } finally {
      return result
    }
  }
}
