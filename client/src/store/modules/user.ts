import { defineStore } from 'pinia'
import { ref } from 'vue'

import store from '@/store'

import { getUserInfo as getUserInfoApi, type UserApiResult } from '@/api/user'
import {
  getCurrUserMenuPerms as getCurrUserMenuPermsApi,
  getAllApiPerms as getAllApiPermsApi,
  type PermApiResult
} from '@/api/perm'
import type { MenuApiResult } from '@/api/menu'

export const useUserStore = defineStore('user', () => {
  /** 用户信息 */
  const userInfo = ref<UserApiResult>()
  const getUserInfo = async (reload?: boolean): Promise<UserApiResult> => {
    if (userInfo.value && !reload) return userInfo.value
    const res = await getUserInfoApi()
    if (res?.code === 200) {
      const user = res.data as UserApiResult
      userInfo.value = user
      return user
    }
    return { id: '', account: '', avatar: '' } as UserApiResult
  }
  /** 当前用户 权限菜单 */
  const currUserMenuPerms = ref<MenuApiResult[]>([])
  const getCurrUserMenuPerms = async () => {
    const res = await getCurrUserMenuPermsApi()
    if (res?.code === 200) {
      currUserMenuPerms.value = res.data as MenuApiResult[]
      return currUserMenuPerms.value
    }
    return []
  }

  const allApiPerms = ref<PermApiResult[]>([])
  const getAllApiPerms = async () => {
    if (allApiPerms.value.length > 0) return allApiPerms.value
    const res = await getAllApiPermsApi()
    if (res?.code === 200) {
      allApiPerms.value = res.data as PermApiResult[]
    }
    return allApiPerms.value
  }

  return { userInfo, getUserInfo, currUserMenuPerms, getCurrUserMenuPerms, allApiPerms, getAllApiPerms }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
