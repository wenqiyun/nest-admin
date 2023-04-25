import { ref } from 'vue'

import { getActiveThemeName, setActiveThemeName } from '@/utils/cache'

export type ThemeName = 'normal' | 'dark' | 'dark-blue'

interface ITheme {
  title: string
  name: ThemeName
}

const themeList: ITheme[] = [
  {
    title: '默认',
    name: 'normal'
  },
  {
    title: '黑暗',
    name: 'dark'
  },
  {
    title: '深蓝',
    name: 'dark-blue'
  }
]

/** 在 html 根元素上挂载 class */
const setHtmlClassName = (value: ThemeName) => {
  document.documentElement.className = value
}

/** 当前使用的主题名称 */
const activeThemeName = ref<ThemeName>(getActiveThemeName() || 'normal')

const initTheme = () => {
  setHtmlClassName(activeThemeName.value)
}

const setTheme = (value: ThemeName) => {
  activeThemeName.value = value
  setHtmlClassName(activeThemeName.value)
  setActiveThemeName(activeThemeName.value)
}

/** 主题 hook */
export function useTheme() {
  return { themeList, activeThemeName, initTheme, setTheme }
}
