<template>
  <div class="app-wrapper" :class="classObj">
    <Sidebar />
    <div class="main-container">
      <div>
        <Navbar></Navbar>
      </div>
      <AppMain></AppMain>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Navbar from './components/Navbar/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  setup () {
    const store = useStore()
    const classObj = computed(() => {
      return {
        hideSidebar: !store.state.app.sidebar.opened,
        openSidebar: store.state.app.sidebar.opened,
        withoutAnimation: store.state.app.sidebar.withoutAnimation,
        mobile: store.state.app.device === 'mobile'
      }
    })
    return {
      classObj
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrappers {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
