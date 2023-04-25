<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="scale-slide">
        <!-- <keep-alive> -->
        <component class="main-content" :is="Component" :key="key" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const key = computed(() => {
  return route.path
})
</script>

<style lang="scss" scoped>
.app-main {
  min-height: 100vh;
  width: 100%;
  padding: calc(var(--header-height) + 7px) 7px 7px 7px;
  position: relative;
  overflow: hidden;
  background-color: var(--body-bg-color);
}

// .fixed-header + .app-main {
//   height: 100vh;
//   overflow: auto;
// }

// .hasTagsView {
//   .app-main {
//     min-height: calc(100vh - var(--header-height));
//   }
//   .fixed-header + .app-main {
//     padding-top: var(--header-height);
//   }
// }
</style>
