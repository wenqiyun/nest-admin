<script lang="tsx">
import { h, type VNode } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const vnodes: VNode[] = []
    if (props.icon) {
      vnodes.push(h(SvgIcon, { name: props.icon }))
    }
    return () => vnodes
  }
}
</script>
