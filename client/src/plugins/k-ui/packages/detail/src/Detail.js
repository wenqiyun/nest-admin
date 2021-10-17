import { defineComponent, computed, h } from 'vue'
import Col from './DetailCol'

const KDetail = defineComponent({
  name: 'KDetail',
  components: { Col },
  props: {
    // 描述列表标题，显示最顶部
    title: String,
    // 是否展示边框
    border: Boolean,
    data: {
      type: [Object, Array],
      required: true,
      default: () => {
        return {}
      }
    },
    // formatter: Function, 当前
    // { label: '', prop: '', formatter: () => {} }
    columns: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    // 按 colNum 数排列，最后一行不足，未排满，补足方式 lastMerge 最后一个 Item 合并补足， addMerge 增加一个新的 空 item 补足
    fillMode: {
      type: String,
      default: 'lastMerge',
      validator (val) {
        return ['lastMerge', 'addMerge'].includes(val)
      }
    },
    // 一行的 Items 数
    colNum: {
      type: [Number, Object],
      default: 3
    },
    layout: {
      type: String,
      default: 'horizontal',
      validator (val) {
        return ['horizontal', 'vertical'].includes(val)
      }
    },
    // 全局 label align
    labelAlign: {
      type: String,
      default: 'left',
      validator (val) {
        return ['left', 'center', 'right'].includes(val)
      }
    },
    contentAlign: {
      type: String,
      default: 'left',
      validator (val) {
        return ['left', 'center', 'right'].includes(val)
      }
    }
  },
  setup (props, { attrs, slots }) {
    const classes = computed(() => ['k-detail', `is-${props.layout}`, { 'is-border': props.border }])

    // columnNum 一行显示多少个 item
    // // formatter: Function, 当前
    // { label: '', prop: '', formatter: () => {} }
    const genChildRow = (children = []) => {
      const labelCols = []
      const contentCols = []
      children.forEach((v, index) => {
        const child = {
          labelAlign: props.labelAlign,
          contentAlign: props.contentAlign,
          ...v,
          ...{ content: typeof v.content === 'function' ? v.content(props.data, props.data[v.prop]) : (v.content || props.data[v.prop]) }
        }
        labelCols.push(h(Col, { border: !!props.border, type: 'label', layout: props.layout, child }))
        contentCols.push(h(Col, { border: !!props.border, type: 'content', layout: props.layout, child }))
      })

      const rows = []
      if (props.layout === 'vertical') {
        rows.push(
          h('tr', { class: 'k-detail__row' }, labelCols)
        )
        rows.push(
          h('tr', { class: 'k-detail__row' }, contentCols)
        )
      } else {
        const cols = []
        labelCols.forEach((v, i) => {
          cols.push(v)
          cols.push(contentCols[i])
        })
        rows.push(
          h('tr', { class: 'k-detail__row' }, cols)
        )
      }
      return rows
    }

    // lastChildren ， fillNum 补足数
    const fillRow = (lastChildren, fillNum) => {
      if (props.fillMode === 'addMerge') {
        lastChildren.push({ label: '', content: '', colspan: fillNum })
      } else {
        lastChildren[lastChildren.length - 1].colspan = fillNum
      }
      return lastChildren
    }

    const genRows = () => {
      let children = []
      const rows = []
      // let rowsNum = 0 // 记录一共有多少行
      for (let i = 0, len = props.columns.length; i < len; i++) {
        children.push(props.columns[i])
        if ((i + 1) % props.colNum === 0 || i + 1 === len) {
          // 最后一行，判断是满行，不足，补足
          if (i + 1 === len) {
            const num = len % props.colNum
            if (num > 0) children = fillRow(children, props.colNum - num + 1)
          }
          rows.push(...genChildRow(children))
          children = []
        }
      }

      return rows
    }

    const title = slots.title || props.title
    const titleVNode = title ? h('div', { class: 'k-detail__title' }, title) : null
    return () => h('div', { class: classes.value }, [
      titleVNode,
      h('div', { class: 'k-detail__view' }, [
        h('table', [
          h('tbody', [
            genRows()
          ])
        ])
      ])
    ])
  }
})

export default KDetail
