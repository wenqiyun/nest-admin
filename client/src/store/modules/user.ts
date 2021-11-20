import {
  ActionContext,
  ActionTree,
  CommitOptions,
  DispatchOptions,
  GetterTree,
  Module,
  MutationTree,
  Store as VuexStore
} from 'vuex'
import { ResultData } from '@/common/types/apiResult.type'
import { RootState } from '../index'
import { login, UserApiResult, UserLogin, getUserInfo } from '@/api/user'
import { PermApiResult, getCurrUserMenuPerms, getAllApiPerms } from '@/api/perm'
import { MenuTypeContants, MenuApiResult } from '@/api/menu'

export enum UserMutationContants {
  SET_USER = 'SET_USER',
  SET_PERMSMENU = 'SET_PERMSMENUS',
  SET_ALLAPIPERMS = 'SET_APIPERMS'
}

export enum UserActionContants {
  GET_USER_MENU_PERM = 'user/getCurrUserMenuPerm',
  // LOGIN = 'user/login',
  GET_ALL_API_PERMS = 'user/getAllApiPerms'
}

export interface UserState {
  user: UserApiResult
  permMenus: MenuApiResult[]
  permButton: MenuApiResult[]
  permTabs: MenuApiResult[]
  allApiPerms: PermApiResult[]
}

const state: UserState = {
  user: { id: '', account: '', avatar: '' },
  permMenus: [],
  permButton: [],
  permTabs: [],
  allApiPerms: []
}

interface UserMutation {
  [UserMutationContants.SET_USER](state: UserState, user: UserApiResult): void
  [UserMutationContants.SET_PERMSMENU](state: UserState, permSource: MenuApiResult[]): void
  [UserMutationContants.SET_ALLAPIPERMS](state: UserState, apiPerms: Array<PermApiResult>): void
}

const mutations: MutationTree<UserState> & UserMutation = {
  [UserMutationContants.SET_USER]: (state: UserState, user: UserApiResult) => {
    state.user = user
  },
  [UserMutationContants.SET_PERMSMENU]: (state: UserState, permSource: MenuApiResult[]) => {
    permSource.forEach(v => {
      switch (v.type) {
        case MenuTypeContants.MENU:
          state.permMenus.push(v)
          break
        case MenuTypeContants.TAB:
          state.permTabs.push(v)
          break
        case MenuTypeContants.BUTTON:
          state.permButton.push(v)
          break
        default:
          break
      }
    })
  },
  [UserMutationContants.SET_ALLAPIPERMS]: (state: UserState, apiPerms: Array<PermApiResult>) => {
    state.allApiPerms = apiPerms
  }
}

type AugmentedActionContext = {
  state: UserState,
  commit<K extends keyof UserMutation>(key: K, payload?: Parameters<UserMutation[K]>[1]): ReturnType<UserMutation[K]>
} & Omit<ActionContext<UserState, RootState>, 'commit' | 'state'>

interface UserAction {
  getAllApiPerms({ commit, state }: AugmentedActionContext): Promise<Array<PermApiResult>>
  getCurrUserMenuPerm({ commit }: AugmentedActionContext): Promise<MenuApiResult[]>
  // logout({ commit }: AugmentedActionContext): void
  // resetToken()
}

const actions: ActionTree<UserState, RootState> & UserAction = {
  getCurrUserMenuPerm: async ({ commit }: AugmentedActionContext): Promise<MenuApiResult[]> => {
    const res = await getCurrUserMenuPerms()
    if (res?.code === 200) {
      const data: MenuApiResult[] = res.data as MenuApiResult[]
      commit(UserMutationContants.SET_PERMSMENU, data)
      return data
    }
    return []
  },
  getAllApiPerms: async ({ commit, state }: AugmentedActionContext): Promise<Array<PermApiResult>> => {
    if (state.allApiPerms.length > 0) return state.allApiPerms
    const res = await getAllApiPerms()
    if (res.code === 200) {
      const apiPerms = res.data as Array<PermApiResult>
      commit(UserMutationContants.SET_ALLAPIPERMS, apiPerms)
      return apiPerms
    }
    return []
  }
}

export type UserStore<S = UserState> = Omit<
VuexStore<S>, 'commit' | 'dispatch'> & {
  commit<K extends keyof UserMutation, P extends Parameters<UserMutation[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<UserMutation[K]>
} & {
  dispatch<K extends keyof UserAction, P extends Parameters<UserAction[K]>[1]>(
    key: K,
    payload?: P,
    options?: DispatchOptions
  ): ReturnType<UserAction[K]>
}

export const UserModule: Module<UserState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}
