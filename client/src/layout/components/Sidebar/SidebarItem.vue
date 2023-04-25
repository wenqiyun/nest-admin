<template>
  <div v-if="!item.meta?.hidden || onlyOneChild?.meta?.noShowingChildren" :class="{ 'simple-mode': props.isCollapse, 'first-level': props.isFirstLevel }">
    <template v-if="!item.meta?.hidden && hasOneShowingChild(item.children || [], item) && (!onlyOneChild?.children || onlyOneChild?.meta?.noShowingChildren) && !item.meta?.alwayShow">
      <sidebar-item-link v-if="onlyOneChild?.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <SidebarItemIcon v-if="!!(onlyOneChild.meta?.icon || item.meta?.icon)" :icon="((onlyOneChild.meta?.icon || item.meta?.icon) as string)"></SidebarItemIcon>
          <template #title>{{ onlyOneChild.meta?.title }}</template>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-sub-menu v-else-if="!item.meta?.hidden" :index="resolvePath(item.path)">
      <template #title>
        <SidebarItemIcon v-if="!!item.meta?.icon" :icon="(item.meta?.icon as string)"></SidebarItemIcon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-collapse="props.isCollapse" :is-first-level="false" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import { ref, type PropType } from 'vue'
import path from 'path-browserify'
import SidebarItemIcon from './SidebarItemIcon.vue'
import SidebarItemLink from './SidebarItemLink.vue'
import { isExternal } from '@/utils/validate'
const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  },
  isCollapse: {
    type: Boolean,
    default: false
  },
  isFirstLevel: {
    type: Boolean,
    default: true
  }
})

const onlyOneChild = ref<RouteRecordRaw>()

const hasOneShowingChild = (children: RouteRecordRaw[], parent: RouteRecordRaw): boolean => {
  const showingChildren = children.filter((route: RouteRecordRaw) => {
    if (route.meta?.hidden) return false
    onlyOneChild.value = route
    return true
  })
  if (showingChildren.length === 1) return true
  if (showingChildren.length === 0) {
    const meta = { ...parent.meta, noShowingChildren: true }
    onlyOneChild.value = { ...parent, path: '', ...{ meta } }
    return true
  }
  return false
}

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) return routePath
  if (isExternal(props.basePath)) return props.basePath
  return path.resolve(props.basePath, routePath)
}
</script>

<style lang="scss" scoped>
.simple-mode {
  &.first-level {
    :deep(.el-sub-menu) {
      .el-sub-menu__icon-arrow {
        display: none;
      }
      span {
        visibility: hidden;
      }
    }
  }
}
</style>
