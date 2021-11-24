import { store } from '@/store/index'

function checkPermission (el: any, binding: any) {
  const { value } = binding
  const hasPerm = () => {
    const { permButton, permTabs } = store.state.user
    if (typeof value === 'string') {
      return permButton.findIndex(v => v.code === value) > -1 || permTabs.findIndex(v => v.code === value) > -1
    } else {
      const { type, code } = value
      if (type === 'button') return permButton.findIndex(v => v.code === code) > -1
      else if (type === 'tab') return permTabs.findIndex(v => v.code === code) > -1
      else throw new Error('v-perm 指令接收 string 或 { type: "button" | "tab", code: string } 的格式')
    }
  }
  if (!hasPerm()) el.parentNode?.removeChild(el)
}

export default {
  mounted (el: any, binding: any) {
    checkPermission(el, binding)
  },
  updated (el: any, binding: any) {
    checkPermission(el, binding)
  }
}
