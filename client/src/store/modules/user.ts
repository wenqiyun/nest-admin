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
import { PermApiResult, getCurrUserPerms } from '../../api/perm'
import { MenuTypeContants, MenuApiResult } from '../../api/menu'

export enum UserMutationContants {
  SET_USER = 'SET_USER',
  SET_PERMSMENU = 'SET_PERMSMENUS',
  SET_APIPERMS = 'SET_APIPERMS'
}

export enum UserActionContants {
  LOGIN = 'user/login',
  GET_CURRENT_USER_API_PERMS = 'user/getCurrUserApiPerms'
}

export interface UserState {
  user: UserApiResult
  permMenus: MenuApiResult[]
  permButton: MenuApiResult[]
  permTabs: MenuApiResult[]
  apiPerms: PermApiResult[]
}

const state: UserState = {
  user: { id: 0, account: '', avatar: '' },
  permMenus: [],
  permButton: [],
  permTabs: [],
  apiPerms: []
}

interface UserMutation {
  [UserMutationContants.SET_USER](state: UserState, user: UserApiResult): void
  [UserMutationContants.SET_PERMSMENU](state: UserState, permSource: MenuApiResult[]): void
  [UserMutationContants.SET_APIPERMS](state: UserState, apiPerms: Array<PermApiResult>): void
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
  [UserMutationContants.SET_APIPERMS]: (state: UserState, apiPerms: Array<PermApiResult>) => {
    state.apiPerms = apiPerms
  }
}

type AugmentedActionContext = {
  state: UserState,
  commit<K extends keyof UserMutation>(key: K, payload?: Parameters<UserMutation[K]>[1]): ReturnType<UserMutation[K]>
} & Omit<ActionContext<UserState, RootState>, 'commit' | 'state'>

interface UserAction {
  login({ commit }: AugmentedActionContext, loginData: UserLogin): Promise<ResultData<string>>
  getCurrUserApiPerms({ commit, state }: AugmentedActionContext): Promise<Array<PermApiResult>>
  // getUserInfoPerm({ commit }: AugmentedActionContext): Promise<ResultData<UserApiResult>>
  // logout({ commit }: AugmentedActionContext): void
  // resetToken()
}

const actions: ActionTree<UserState, RootState> & UserAction = {
  login: async ({ commit }: AugmentedActionContext, loginData: UserLogin): Promise<ResultData<string>> => {
    const res = await login(loginData)
    if (res.code === 200) {
      sessionStorage.setItem('token-key', res.data as string)
    }
    return res
  },
  // getUserInfoPerm: async ({ commit }: AugmentedActionContext): Promise<ResultData<UserApiResult>> => {
  //   const res = await getUserInfo()
  //   if (res.code === 200) {
  //     commit(UserMutationContants.SET_USER, res.data)
  //     return res
  //   }
  //   return res
  // }
  getCurrUserApiPerms: async ({ commit, state }: AugmentedActionContext): Promise<Array<PermApiResult>> => {
    if (state.apiPerms.length > 0) return state.apiPerms
    const res = await getCurrUserPerms()
    if (res.code === 200) {
      const apiPerms = res.data as Array<PermApiResult>
      commit(UserMutationContants.SET_APIPERMS, apiPerms)
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
