<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <router-link to="/">
      <svg-icon name="nest-logo" class="sidebar-logo"></svg-icon>
      <transition name="sidebar-logo">
        <div class="sidebar-logo-text">Nest-Admin</div>
      </transition>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  collapse: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: var(--navigationbar-height);
  line-height: var(--navigationbar-height);
  background-color: var(--sidebarlogo-bg-color);
  // text-align: center;
  padding-left: calc(var(--el-menu-base-level-padding, 20px) - 7px);
  overflow: hidden;
  z-index: 1;
  box-shadow: 1px 1px 0 0 #e8e8e8;

  .sidebar-logo-text {
    display: inline-block;
    vertical-align: middle;
    margin-left: 12px;
    font-family: 'app-name-font';
    font-size: 24px;
    color: var(--sidebarlogo-text-color);
  }
}
.sidebar-logo {
  font-size: 32px;
  vertical-align: middle;
  display: inline-block;
}
</style>
