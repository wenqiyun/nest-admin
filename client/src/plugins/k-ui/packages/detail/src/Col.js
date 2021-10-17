import { defineComponent, toRefs, h } from 'vue'

const KCol = defineComponent({
  name: 'KCol',
  props: {
    border: Boolean,
    colon: Boolean,
    child: Object,
    type: {
      type: String,
      validator (val) {
        return ['label', 'content'].includes(val)
      }
    },
    layout: {
      type: String,
      validator (val) {
        return ['horizontal', 'vertical'].includes(val)
      }
    }
  },
  setup (props) {
    const { child, type, layout, colon, border } = toRefs(props)
    const { label, colspan = 1, key, content, labelAlign, contentAlign, labelStyle = '', contentStyle = '' } = child
    const labelProps = {
      'k-detail-item__label': true,
      'k-detail-item--colon': colon.value,
      [`is-${labelAlign.value}`]: !!labelAlign.value
    }
    if (layout.value === 'vertical') {
      labelProps.colspan = colspan
    }

    if (border.value) {
      if (type.value === 'label') {
        return h('th', { style: contentStyle, class: labelProps, colspan: labelProps.colspan }, label)
      }
      return h('td', { style: contentStyle, class: ['k-detail-item__content', `is-${contentAlign}`], key, colspan }, content)
    }

    if (layout.value === 'vertical') {
      if (type.value === 'content') {
        return h('td', { style: contentStyle, colspan, class: ['k-detail-item__wrap', `is-${contentAlign}`], key }, [
          h('div', { class: 'k-detail-item__content' }, content)
        ])
      }
      return h('td', { style: labelStyle, colspan, class: ['k-detail-item__wrap', `is-${contentAlign}`], key }, [
        h('div', { class: { 'k-detail-item__label': true, 'k-detail-item--colon': colon } }, label)
      ])
    }

    if (type.value === 'content') {
      return h('td', { style: contentStyle, class: 'k-detail-item__wrap', key }, [
        h('div', { class: 'k-detail-item__content' }, content)
      ])
    }

    return h('td', { style: labelStyle, class: 'k-detail-item__wrap', key }, [
      h('div', { ...labelProps }, label)
    ])
  }
})

export default KCol
