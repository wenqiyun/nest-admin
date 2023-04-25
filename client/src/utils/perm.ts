import { useUserStoreHook } from '@/store/modules/user'

export const hasPerm = (value: any) => {
  const userStore = useUserStoreHook()
  if (typeof value === 'string') {
    return userStore.currUserMenuPerms.findIndex((v) => v.code === value) > -1
  } else {
    const { type, code } = value
    if (!['button', 'tab'].includes(type)) {
      throw new Error('v-perm 指令接收 string 或 { type: "button" | "tab", code: string } 的格式')
    }
    return userStore.currUserMenuPerms.findIndex((v) => v.code === code && v.type === type) > -1
  }
}

/** 判断多个，同时满足 */
export const hasPerms = (valArr: any[]) => {
  for (let i = 0; i < valArr.length; i++) {
    if (!hasPerm(valArr[i])) return false
  }
  return true
}
