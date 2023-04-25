import { hasPerm } from '@/utils/perm'
import type { Directive } from 'vue'

const checkPerm = (el: any, binding: any) => {
  const { value } = binding
  if (!hasPerm(value)) el.parentNode?.removeChild(el)
}

const perm: Directive = {
  mounted: (el: any, binding: any) => {
    checkPerm(el, binding)
  },
  updated(el: any, binding: any) {
    checkPerm(el, binding)
  }
}

export default perm
