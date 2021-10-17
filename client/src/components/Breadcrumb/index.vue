<template>
  <el-breadcrumb class="app-breadcrumb"  separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { compile } from 'path-to-regexp'
import { AppRouteRecordRaw } from '@/common/types/appRoute.type'
import { RouteLocationMatched, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Breadcrumb',
  setup () {
    const currRoute = computed(() => useRoute())

    const pathCompile = (path: string): string => {
      return compile(path)(currRoute.value.params)
    }

    const router = useRouter()

    const handleLink = (item: RouteLocationMatched | AppRouteRecordRaw) => {
      if (item.redirect && item.redirect !== 'noRedirect') {
        router.push(item.redirect as string)
        return
      }
      router.push(pathCompile(item.path))
    }
    // 是否是首页
    const isDashboard = (route: RouteLocationMatched | AppRouteRecordRaw): boolean => {
      const name = route && route.name as string
      if (!name) return false
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    }

    const levelList = ref<Array<AppRouteRecordRaw | RouteLocationMatched>>()

    const getBreadcrumb = () => {
      const matched: Array<AppRouteRecordRaw | RouteLocationMatched> = currRoute.value.matched.filter(v => v.meta?.title)
      const first = matched[0]
      const dashboard = { path: '/dashboard', meta: { title: '首页' } } as AppRouteRecordRaw
      if (!isDashboard(first)) matched.unshift(dashboard)
      levelList.value = matched.filter(v => v.meta && v.meta.title && !v.meta.breadcrumb)
    }

    // watch(currRoute.value, () => { getBreadcrumb() })
    // 会出现 [Vue warn]: Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance
    // https://github.com/vuejs/vue-next/issues/2027
    watchEffect(() => {
      if (currRoute.value) getBreadcrumb()
    })

    return {
      levelList,
      handleLink,
      getBreadcrumb
    }
  }
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
