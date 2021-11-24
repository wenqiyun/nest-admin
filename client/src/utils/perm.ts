import { store } from '@/store/index'

export type PermCode = {
  type: 'button' | 'tab'
  code: string
} | string

export default function hasPerm (val: PermCode): boolean {
  const { permButton, permTabs } = store.state.user
  if (typeof val === 'string') {
    return permButton.findIndex(v => v.code === val) > -1 || permTabs.findIndex(v => v.code === val) > -1
  } else {
    const { type, code } = val
    if (type === 'button') return permButton.findIndex(v => v.code === code) > -1
    else if (type === 'tab') return permTabs.findIndex(v => v.code === code) > -1
    else throw new Error('v-perm 指令接收 string 或 { type: "button" | "tab", code: string } 的格式')
  }
}
