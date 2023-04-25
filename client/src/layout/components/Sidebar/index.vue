<template>
  <div class="has-logo">
    <SidebarLogo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :collapse-transition="false" mode="vertical">
        <SidebarItem
          v-for="item in permRoutes"
          :key="item.path"
          :item="item"
          :is-collapse="isCollapse"
          :base-path="item.path"
        ></SidebarItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import { usePermissionStore } from '@/store/modules/permission'
import { useAppStore } from '@/store/modules/app'

import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'

const appStore = useAppStore()
const { routes: permRoutes } = usePermissionStore()
const route = useRoute()

const activeMenu = computed(() => {
  const { path, meta } = route
  if (meta.activeMenu) return meta.activeMenu
  return path
})

const isCollapse = computed(() => !appStore.sidebar.opened)
</script>

<style lang="scss" scoped>
.has-logo {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  .el-scrollbar {
    height: calc(100% - var(--navigationbar-height));
  }
}

.el-scrollbar {
  height: 100%;
  :deep(.scrollbar-wrapper) {
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }

    .el-scrollbar__bar.is-vertical {
      right: 0px;
    }
    .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;
    }

    .svg-icon {
      min-width: 1em;
      margin-right: 8px;
      font-size: 18px;
    }
  }
  // 滚动条
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      // 隐藏水平滚动条
      display: none;
    }
  }
}
</style>
