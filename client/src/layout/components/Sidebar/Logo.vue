<template>
  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }">
    <router-link class="sidebar-logo-link" to="/">
      <img v-if="logo" :src="logo" class="sidebar-logo">
      <h1 v-if="!collapse || !logo" class="sidebar-title">{{ title }} </h1>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import nestjsLogo from '@/assets/imgs/nest-logo.svg'

export default defineComponent({
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: 'nest-admin',
      logo: nestjsLogo
    }
  }
})
</script>

<style lang="scss" scoped>

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #304156;
  border-bottom: 1px solid rgb(81, 95, 113);
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
