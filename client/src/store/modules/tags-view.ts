import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export type ITagView = Partial<RouteLocationNormalized>

export const useTagsViewStore = defineStore('tags-viewe', () => {
  /** 缓存的 tagsViews */
  const cacheViews = ref<string[]>([])
  const addCacheView = (view: ITagView) => {
    const routeName = view.name as string
    if (cacheViews.value.includes(routeName)) return
    if (!view.meta?.noCache) {
      cacheViews.value.push(routeName)
    }
  }

  const delCacheView = (view: ITagView) => {
    const routeName = view.name as string
    const index = cacheViews.value.indexOf(routeName)
    index > -1 && cacheViews.value.splice(index, 1)
  }

  const delOtherCacheView = (view: ITagView) => {
    const routeName = view.name as string
    const index = cacheViews.value.indexOf(routeName)
    if (index > -1) {
      cacheViews.value = cacheViews.value.slice(index, index + 1)
    }
    cacheViews.value = []
  }

  const delAllCacheView = () => {
    cacheViews.value = []
  }

  /**  打开的 tagsViews */
  const visitedViews: Ref<ITagView[]> = ref<ITagView[]>([])
  const addVisitedView = (view: ITagView) => {
    if (
      visitedViews.value.some((v, index) => {
        if (v.path === view.path) {
          if (v.fullPath !== view.fullPath) {
            // 防止 query 丢失
            visitedViews.value[index] = Object.assign({}, view)
          }
          return true
        }
        return false
      })
    ) {
      return
    }
    visitedViews.value.push(Object.assign({}, view))
    addCacheView(view)
  }
  const delVisitedView = (view: ITagView) => {
    for (const [i, v] of visitedViews.value.entries()) {
      if (v.path === view.path) {
        visitedViews.value.splice(i, 1)
        break
      }
    }
    delCacheView(view)
  }
  const delOthersVisitedViews = (view: ITagView) => {
    visitedViews.value = visitedViews.value.filter((v) => {
      return v.meta?.affix || v.path === view.path
    })
    delOtherCacheView(view)
  }
  const delAllVisitedViews = () => {
    // keep affix tags
    const affixTags = visitedViews.value.filter((tag) => tag.meta?.affix)
    visitedViews.value = affixTags
    delAllCacheView()
  }

  return { visitedViews, addVisitedView, delVisitedView, delOthersVisitedViews, delAllVisitedViews }
})
