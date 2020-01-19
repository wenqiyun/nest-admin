import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const { code, prop = 'btn' } = value
    const hasPermission = () => {
      if (['tab', 'btn'].includes(prop)) {
        return store.getters[`${prop}Menu`].findIndex(v => v === code) > -1
      } else {
        console.error('need Object! Like v-permission="{ prop: \'but\', code: \'....\' }"')
        return false
      }
    }
    if (!hasPermission()) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
