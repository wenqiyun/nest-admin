import Cookies from 'js-cookie'

const TokenKey = 'admin-tokenKey'

export function getToken () {
  return localStorage.getItem(Cookies.get(TokenKey))
}

export function setToken (token) {
  const now = Date.now()
  Cookies.set(TokenKey, now)
  localStorage.setItem(now, `Bearer ${token}`)
}

export function removeToken () {
  localStorage.removeItem(Cookies.get(TokenKey))
  Cookies.remove(TokenKey)
}
