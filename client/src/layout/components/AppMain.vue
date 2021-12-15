<template>
  <router-view v-slot="{ Component }">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" class="app-container" :key="key"/>
        </keep-alive>
      </transition>
    </section>
  </router-view>
</template>
  <!-- 去除浏览器 router 警告， router-view 不能再 section / keep-alive 标签下 -->
  <!-- <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section> -->

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
  name: 'AppMain',
  setup () {
    const store = useStore()
    // get currentRoute ，报错 getCurrentInstance 中不存在 ctx ，但是实际在 浏览器中能正确获取值
    // console.log(getCurrentInstance().ctx.$router.currentRoute.value, 1)
    const cachedViews = computed(() => store.state.tagsView.cachedViews)
    const key = computed(() => useRoute().path)
    return {
      key,
      cachedViews
    }
  }
})
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  position: relative;
  min-height: calc(100vh - 50px);
  width: 100%;
  padding: 10px;
  overflow: hidden;
}

.app-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 70px);
  padding: 16px 20px;
  background: #fff;
  overflow-y: auto;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
