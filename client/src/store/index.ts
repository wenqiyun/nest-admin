import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

import { AppState, AppModule } from './modules/app'
import { TagsViewState, TagsViewModule } from './modules/tagsView'
import { PermissionState, PermissionModule } from './modules/permission'
import { UserModule, UserState } from './modules/user'

export type RootState = {
  app: AppState
  tagsView: TagsViewState
  permission: PermissionState
  user: UserState
}

export const store = createStore<RootState>({
  modules: {
    app: AppModule,
    tagsView: TagsViewModule,
    permission: PermissionModule,
    user: UserModule
  }
})

export const key: InjectionKey<Store<RootState>> = Symbol()

export function useStore () {
  return baseUseStore(key)
}
