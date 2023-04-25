<template>
  <el-dropdown trigger="click" @command="handleSetTheme">
    <div>
      <el-tooltip effect="dark" content="主题模式" placement="bottom">
        <el-icon :size="20">
          <MagicStick />
        </el-icon>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="theme in themeList"
          :key="theme.name"
          :disabled="activeThemeName === theme.name"
          :command="theme.name"
        >
          <span>{{ theme.title }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useTheme, type ThemeName } from '_hooks'

const route = useRoute()

const { themeList, activeThemeName, setTheme } = useTheme()
const themeCahce = ref()
const handleSetTheme = (name: ThemeName) => {
  themeCahce.value = activeThemeName.value
  // @ts-ignore
  if (!document.startViewTransition) {
    setTheme(name)
    return
  }
  // @ts-ignore
  const transition = document.startViewTransition(() => {
    setTheme(name)
  })
  transition.ready.then(() => {
    const isLogin = route.name === 'login'
    const x = isLogin ? window.innerWidth / 2 : window.innerWidth
    const y = isLogin ? window.innerHeight / 2 : 0
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: !['dark', 'dark-blue'].includes(name) ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: !['dark', 'dark-blue'].includes(name)
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)'
      }
    )
  })
}
</script>
