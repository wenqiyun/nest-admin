export enum AppStorageKey {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh-token'
}

export function setToken (token: string): void {
  sessionStorage.setItem(AppStorageKey.TOKEN, token)
}

export function getToken (): string | null {
  return sessionStorage.getItem(AppStorageKey.TOKEN)
}

export function setRefreshToken (refreshToken: string): void {
  sessionStorage.setItem(AppStorageKey.REFRESH_TOKEN, refreshToken)
}

export function getRefreshToken (): string | null {
  return sessionStorage.getItem(AppStorageKey.REFRESH_TOKEN)
}

export function clearToken () {
  sessionStorage.clear()
}
