export function isExternal (path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validURL (url: string): boolean {
  const regx = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return regx.test(url)
}

export function isString (str: unknown): boolean {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

// https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
export function validPhone (phone: string): boolean {
  const regx = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/
  return regx.test(phone)
}

export function validEmail (email: string): boolean {
  const regx = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return regx.test(email)
}
