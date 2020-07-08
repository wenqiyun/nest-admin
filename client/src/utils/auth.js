// import Cookies from 'js-cookie'

const TokenKey = 'admin-tokenKey'
const refreshTokenKey = 'admin-refresh-token'

export function getToken () {
  return localStorage.getItem(TokenKey)
}

export function getRefreshToken () {
  return localStorage.getItem(refreshTokenKey)
}

export function setToken (token, refreshToken) {
  localStorage.setItem(TokenKey, token)
  localStorage.setItem(refreshTokenKey, refresh-token)
}

export function removeToken () {
  localStorage.clear()
}
