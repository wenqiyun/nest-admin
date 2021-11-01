// https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
export function validPhone (phone: string): boolean {
  const regx = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/
  return regx.test(phone)
}

export function validEmail (email: string): boolean {
  const regx = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return regx.test(email)
}
