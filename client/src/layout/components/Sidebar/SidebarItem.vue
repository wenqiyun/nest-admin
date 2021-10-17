<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { defineComponent, PropType, ref, toRefs } from 'vue'
import Item from './Item'
import AppLink from './Link.vue'
import { isExternal } from '@/utils/validate'
import { AppRouteRecordRaw } from '@/common/types/appRoute.type'

interface ISidebarItemProps {
  item: AppRouteRecordRaw[] | Record<string, any>
  isNest: boolean
  basePath: string
}

export default defineComponent({
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    item: {
      type: Object as PropType<AppRouteRecordRaw>,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // const data = reactive({
    //   onlyOneChild: null
    // })
    const { basePath } = toRefs<ISidebarItemProps>(props)
    const onlyOneChild = ref<AppRouteRecordRaw | null>(null)
    const hasOneShowingChild = (children: Array<AppRouteRecordRaw> = [], parent: AppRouteRecordRaw): boolean => {
      const showingChildren = children.filter(route => {
        if (route.hidden) return false
        onlyOneChild.value = route
        return true
      })
      if (showingChildren.length === 1) return true
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    }
    const resolvePath = (routePath: string): string => {
      if (isExternal(routePath)) return routePath
      if (isExternal(basePath.value)) return basePath.value
      return path.resolve(basePath.value, routePath)
    }

    return {
      onlyOneChild,
      hasOneShowingChild,
      resolvePath
      // ...toRefs(data)
    }
  }
})
</script>
