import { toRefs, VNode, h, defineComponent } from 'vue'
import SvgIcon from '../../../components/SvgIcon/index.vue'

export default defineComponent({
  name: 'MenuItemIcon',
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const { icon } = toRefs(props)
    const vnodes: VNode[] = []

    if (icon.value) {
      if (icon.value.includes('el-icon')) {
        vnodes.push(h('i', { class: [icon.value, 'sub-el-icon'] }))
      } else {
        vnodes.push(h(SvgIcon, { iconClass: icon.value, style: 'font-size: 20px; vertical-align: middle;' }))
      }
    }
    return () => vnodes
  }
})
