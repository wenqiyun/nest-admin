
import { defineComponent, h, toRefs, VNode } from 'vue'
import SvgIcon from '../../../components/SvgIcon/index.vue'

export default defineComponent({
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const { icon, title } = toRefs(props)
    const vnodes: VNode[] = []
    if (icon.value) {
      if (icon.value.includes('el-icon')) {
        vnodes.push(h('i', { class: [icon.value, 'sub-el-icon'] }))
      } else {
        vnodes.push(h(SvgIcon, { iconClass: icon.value }))
      }
    }
    if (title.value) {
      vnodes.push(h('span', { slot: 'title' }, title.value))
    }
    return () => vnodes
  }
})
