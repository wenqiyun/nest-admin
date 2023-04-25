<template>
  <div :class="classObj" class="app-wrapper">
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <Navbar />
        <TagsView />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { DeviceType, useAppStore } from '@/store/modules/app'

import { AppMain, Navbar, Sidebar, TagsView } from './components'

const appStore = useAppStore()

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
  mobile: appStore.device === DeviceType.Mobile
}))
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100vh;
}

.sidebar-container {
  transition: width 0.28s;
  width: var(--sidebar-width) !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  background-color: var(--sidebar-menu-bg-color);
}

.main-container {
  position: relative;
  min-height: 100%;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.28s;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100vw - var(--sidebar-width));
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: var(--sidebar-hide-width);
  }
  .sidebar-container {
    width: var(--sidebar-hide-width) !important;
  }

  .fixed-header {
    width: calc(100% - var(--sidebar-hide-width));
  }
}
</style>
