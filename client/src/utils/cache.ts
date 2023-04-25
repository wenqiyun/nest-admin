import jwtDecode from 'jwt-decode'

import type { ThemeName } from '_hooks'

export enum CacheKey {
  /** 左侧导航栏 */
  SIDEBAR_STATUS = 'sidebar-status',
  ACTIVE_THEME_NAME = 'active-theme-name',
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh-token',
  REFRESH_TOKEN_EXP = 'rt-exp'
}
interface ItokenDecode {
  id?: string
  iat: number
  exp: number
}

/**
 * 存储 token 顺带存储 refreshToken
 * token 过期后，会自动根据 refreshToken 刷新 token
 * 如果 refreshToken 过期则必须重新登录
 * @param token
 * @param refreshToken
 */
export function setToken(token: string, refreshToken: string): void {
  localStorage.setItem(CacheKey.TOKEN, token)
  setRefreshToken(refreshToken)
  // 解析过期时间，设置过期
  const rtExp = (jwtDecode(refreshToken) as ItokenDecode)?.exp * 1000
  setRTExp(rtExp)
}

export function getToken(): string | null {
  return localStorage.getItem(CacheKey.TOKEN)
}

export function setRefreshToken(refreshToken: string): void {
  localStorage.setItem(CacheKey.REFRESH_TOKEN, refreshToken)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(CacheKey.REFRESH_TOKEN)
}

export function setRTExp(exp: number): void {
  localStorage.setItem(CacheKey.REFRESH_TOKEN_EXP, `${exp}`)
}
export function getRTExp(): number {
  const rtExpStr = localStorage.getItem(CacheKey.REFRESH_TOKEN_EXP)
  return rtExpStr ? Number(rtExpStr) : 0
}

export function getSidebarStatus() {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS)
}
export function setSidebarStatus(sidebarStatus: 'opened' | 'closed') {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus)
}

export function getActiveThemeName() {
  return localStorage.getItem(CacheKey.ACTIVE_THEME_NAME) as ThemeName
}
export function setActiveThemeName(themeName: ThemeName) {
  localStorage.setItem(CacheKey.ACTIVE_THEME_NAME, themeName)
}

export function clearLocalStorage() {
  const theme = getActiveThemeName()
  localStorage.clear()
  setActiveThemeName(theme)
}
