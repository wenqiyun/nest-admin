import { matchedRouteKey } from 'vue-router'
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
import { RootState } from '../index'

export enum AppMutatinContants {
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
  TOGGLE_DEVICE = 'TOGGLE_DEVICE',
  STE_SIZE = 'STE_SIZE',
}

export enum AppActionContants {
  TOGGLE_SIDEBAR = 'app/toggleSideBar'
}

export interface SideBar {
  opened: boolean
  withoutAnimation: boolean
}

type Device = 'desktop' | 'mobile'

type Size = '' | 'large' | 'medium' | 'small' | 'mini'

export type AppState = {
  sidebar: SideBar
  device: Device
  size: Size
}

const state: AppState = {
  sidebar: {
    opened: sessionStorage.getItem('sidebarStatus') ? !!Number(sessionStorage.getItem('sidebarStatus')) : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: sessionStorage.getItem('size') as Size || 'small'
}

interface AppMutation {
  [AppMutatinContants.TOGGLE_SIDEBAR](state: AppState): void
  [AppMutatinContants.CLOSE_SIDEBAR](state: AppState, withoutAnimation: boolean): void
  [AppMutatinContants.TOGGLE_DEVICE](state: AppState, device: Device): void
  [AppMutatinContants.STE_SIZE](state: AppState, size: Size): void
}

const mutations: MutationTree<AppState> & AppMutation = {
  [AppMutatinContants.TOGGLE_SIDEBAR]: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      sessionStorage.setItem('sidebarStatus', '1')
    } else {
      sessionStorage.setItem('sidebarStatus', '0')
    }
  },
  [AppMutatinContants.CLOSE_SIDEBAR]: (state, withoutAnimation) => {
    sessionStorage.setItem('sidebarStatus', '0')
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  [AppMutatinContants.TOGGLE_DEVICE]: (state, device) => {
    state.device = device
  },
  [AppMutatinContants.STE_SIZE]: (state, size) => {
    state.size = size
    sessionStorage.setItem('size', size)
  }
}

type AugmentedActionContext = {
  commit<K extends keyof AppMutation>(key: K, payload?: Parameters<AppMutation[K]>[1]): ReturnType<AppMutation[K]>
} & Omit<ActionContext<AppState, RootState>, 'commit'>

interface AppAction {
  toggleSideBar({ commit }: AugmentedActionContext): void
  closeSideBar({ commit }: AugmentedActionContext, { withoutAnimation }: SideBar): void
  toggleDevice({ commit }: AugmentedActionContext, device: Device): void
  setSize({ commit }: AugmentedActionContext, size: Size): void
}

const actions: ActionTree<AppState, RootState> & AppAction = {
  toggleSideBar ({ commit }): void {
    commit(AppMutatinContants.TOGGLE_SIDEBAR)
  },
  closeSideBar ({ commit }, { withoutAnimation }): void {
    commit(AppMutatinContants.CLOSE_SIDEBAR, withoutAnimation)
  },
  toggleDevice ({ commit }, device: Device): void {
    commit(AppMutatinContants.TOGGLE_DEVICE, device)
  },
  setSize ({ commit }, size: Size): void {
    commit(AppMutatinContants.STE_SIZE, size)
  }
}

export type AppStore<S = AppState> = Omit<
  VuexStore<S>, 'commit'| 'dispatch'> & {
    commit<K extends keyof AppMutation, P extends Parameters<AppMutation[K]>[1]>(
      key: K,
      payload?: P,
      options?: CommitOptions
    ): ReturnType<AppMutation[K]>
  } & {
    dispatch<K extends keyof AppAction, P extends Parameters<AppAction[K]>[1]>(
      key: K,
      payload?: P,
      options?: DispatchOptions
    ): ReturnType<AppAction[K]>
  }

export const AppModule: Module<AppState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}
