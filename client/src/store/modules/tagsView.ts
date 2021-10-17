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
import { AppRouteRecordRaw } from '@/common/types/appRoute.type'

export enum TagsViewMutationContants {
  ADD_VISITED_VIEW = 'ADD_VISITED_VIEW',
  ADD_CACHED_VIEW = 'ADD_CACHED_VIEW',
  DEL_VISITED_VIEW = 'DEL_VISITED_VIEW',
  DEL_CACHED_VIEW = 'DEL_CACHED_VIEW',
  DEL_OTHERS_VISITED_VIEWS = 'DEL_OTHERS_VISITED_VIEWS',
  DEL_OTHERS_CACHED_VIEWS = 'DEL_OTHERS_CACHED_VIEWS',
  DEL_ALL_VISITED_VIEWS = 'DEL_ALL_VISITED_VIEWS',
  DEL_ALL_CACHED_VIEWS = 'DEL_ALL_CACHED_VIEWS',
  UPDATE_VISITED_VIEW = 'UPDATE_VISITED_VIEW'
}

export enum TagsViewActionContants {
  ADD_VISITED_VIEW = 'tagView/addVisitedView',
  ADD_CACHED_VIEW = 'tagView/addCachedView',
  DEL_VISITED_VIEW = 'tagView/delVisitedView',
  DEL_CACHED_VIEW = 'tagView/delCachedView',
  DEL_OTHERS_VISITED_VIEWS = 'tagView/delOthersVisitedViews',
  DEL_OTHERS_CACHED_VIEWS = 'tagView/delOthersCachedViews',
  DEL_ALL_VISITED_VIEWS = 'tagView/delAllVisitedViews',
  DEL_ALL_CACHED_VIEWS = 'tagView/delAllCachedViews',
  UPDATE_VISITED_VIEW = 'tagView/updateVisitedView'
}

export type TagsViewState = {
  visitedViews: AppRouteRecordRaw[]
  cachedViews: string[]
}

const state: TagsViewState = {
  visitedViews: [],
  cachedViews: []
}

interface TagsViewMutation {
  [TagsViewMutationContants.ADD_VISITED_VIEW](state: TagsViewState, view: AppRouteRecordRaw): void
  [TagsViewMutationContants.ADD_CACHED_VIEW](state: TagsViewState, view: string): void
  [TagsViewMutationContants.DEL_VISITED_VIEW](state: TagsViewState, view: AppRouteRecordRaw): void
  [TagsViewMutationContants.DEL_CACHED_VIEW](state: TagsViewState, view: string | string[]): void
  [TagsViewMutationContants.DEL_OTHERS_VISITED_VIEWS](state: TagsViewState, view: AppRouteRecordRaw): void
  [TagsViewMutationContants.DEL_OTHERS_CACHED_VIEWS](state: TagsViewState, view: string): void
  [TagsViewMutationContants.DEL_ALL_VISITED_VIEWS](state: TagsViewState): void
  [TagsViewMutationContants.DEL_ALL_CACHED_VIEWS](state: TagsViewState): void
  [TagsViewMutationContants.UPDATE_VISITED_VIEW](state: TagsViewState, view: AppRouteRecordRaw): void
}

const mutations: MutationTree<TagsViewState> & TagsViewMutation = {
  [TagsViewMutationContants.ADD_VISITED_VIEW]: (state: TagsViewState, view: AppRouteRecordRaw) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(view)
  },
  [TagsViewMutationContants.ADD_CACHED_VIEW]: (state: TagsViewState, view: string) => {
    if (state.cachedViews.includes(view)) return
    state.cachedViews.push(view)
  },
  [TagsViewMutationContants.DEL_VISITED_VIEW]: (state: TagsViewState, view: AppRouteRecordRaw) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  [TagsViewMutationContants.DEL_CACHED_VIEW]: (state: TagsViewState, view: string | string[]) => {
    const views = []
    views.push(...view)
    views.forEach(v => {
      const index = state.cachedViews.indexOf(v)
      index > -1 && state.cachedViews.splice(index, 1)
    })
  },
  // 需要修改
  [TagsViewMutationContants.DEL_OTHERS_VISITED_VIEWS]: (state: TagsViewState, view: AppRouteRecordRaw) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta || v.path === view.path
    })
  },
  [TagsViewMutationContants.DEL_OTHERS_CACHED_VIEWS]: (state: TagsViewState, view: string) => {
    const index = state.cachedViews.indexOf(view)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },
  // 需要修改
  [TagsViewMutationContants.DEL_ALL_VISITED_VIEWS]: (state: TagsViewState) => {
    state.visitedViews = []
  },
  [TagsViewMutationContants.DEL_ALL_CACHED_VIEWS]: (state: TagsViewState) => {
    state.cachedViews = []
  },
  [TagsViewMutationContants.UPDATE_VISITED_VIEW]: (state: TagsViewState, view: AppRouteRecordRaw) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

type AugmentedActionContext = {
  commit<K extends keyof TagsViewMutation>(key: K, payload?: Parameters<TagsViewMutation[K]>[1]): ReturnType<TagsViewMutation[K]>
} & Omit<ActionContext<TagsViewState, RootState>, 'commit'>

interface TagsAction {
  addVisitedView({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void
  addCachedView({ commit }: AugmentedActionContext, view: string): void
  delVisitedView({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void
  delCachedView({ commit }: AugmentedActionContext, view: string): void
  delOthersVisitedViews({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void
  delOthersCachedViews({ commit }: AugmentedActionContext, view: string): void
  delAllVisitedViews({ commit }: AugmentedActionContext): void
  delAllCachedViews({ commit }: AugmentedActionContext): void
  updateVisitedView({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void
}

const actions: ActionTree<TagsViewState, RootState> & TagsAction = {
  addVisitedView ({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void {
    commit(TagsViewMutationContants.ADD_VISITED_VIEW, view)
  },
  addCachedView ({ commit }: AugmentedActionContext, view: string): void {
    commit(TagsViewMutationContants.ADD_CACHED_VIEW, view)
  },
  delVisitedView ({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void {
    commit(TagsViewMutationContants.DEL_VISITED_VIEW, view)
  },
  delCachedView ({ commit }: AugmentedActionContext, view: string): void {
    commit(TagsViewMutationContants.DEL_CACHED_VIEW, view)
  },
  delOthersVisitedViews ({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void {
    commit(TagsViewMutationContants.DEL_OTHERS_VISITED_VIEWS, view)
  },
  delOthersCachedViews ({ commit }: AugmentedActionContext, view: string): void {
    commit(TagsViewMutationContants.DEL_OTHERS_CACHED_VIEWS, view)
  },
  delAllVisitedViews ({ commit }: AugmentedActionContext): void {
    commit(TagsViewMutationContants.DEL_ALL_VISITED_VIEWS)
  },
  delAllCachedViews ({ commit }: AugmentedActionContext): void {
    commit(TagsViewMutationContants.DEL_ALL_CACHED_VIEWS)
  },
  updateVisitedView ({ commit }: AugmentedActionContext, view: AppRouteRecordRaw): void {
    commit(TagsViewMutationContants.UPDATE_VISITED_VIEW, view)
  }
}

export type TagsStore<S = TagsViewState> = Omit<
  VuexStore<S>, 'commit' | 'dispatch'> & {
    commit<K extends keyof TagsViewMutation, P extends Parameters<TagsViewMutation[K]>[1]>(
      key: K,
      payload?: P,
      options?: CommitOptions
    ): ReturnType<TagsViewMutation[K]>
  } & {
    dispatch<K extends keyof TagsAction, P extends Parameters<TagsAction[K]>[1]>(
      key: K,
      payload?: P,
      options?: DispatchOptions
    ): ReturnType<TagsAction[K]>
  }

export const TagsViewModule: Module<TagsViewState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}
