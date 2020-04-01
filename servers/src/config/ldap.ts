import { registerAs } from '@nestjs/config'

export default registerAs('ldap', () => ({
  server: process.env.LDAP_SERVER,
  baseDN: process.env.LDAP_BASEDN,
  bindPassword: process.env.LDAP_BINDPASSWORD || null,
  bindCredentials: process.env.LDAP_BINDCREDENTIALS,
  searchDN: process.env.LDAP_SEARCHDN,
  searchStandard: process.env.LDAP_SEARCHSTANDARD,
  emailPostfix: process.env.LDAP_EMAILPOSTFIX || null
}))
