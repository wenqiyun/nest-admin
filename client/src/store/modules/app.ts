import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getSidebarStatus, setSidebarStatus } from '../../utils/cache'

interface ISidebar {
  opened: boolean
  withoutAnimation: boolean
}

export enum DeviceType {
  Mobile,
  Desktop
}

export const useAppStore = defineStore('app', () => {
  const sidebar: ISidebar = reactive({
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  })

  const device = ref<DeviceType>(DeviceType.Desktop)

  const toggleSidebar = (withAnimation: boolean) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withAnimation

    setSidebarStatus(sidebar.opened ? 'opened' : 'closed')
  }

  const colseSidebar = (withAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withAnimation
    setSidebarStatus('closed')
  }

  const toggleDevice = (value: DeviceType) => {
    device.value = value
  }

  return { sidebar, device, toggleSidebar, colseSidebar, toggleDevice }
})
