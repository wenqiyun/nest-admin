<template>
  <el-form ref="elFormRef" :model="modelValue" :inline="inline" :style="inline ? 'display: inline-block' : ''" v-bind="$attrs">
    <slot v-if="mode === render"></slot>
    <template v-else>
      <el-form-item v-for="(item, index) in formItemsTmp" :label="item.label" :prop="item.prop" :key="index">
        <template v-if="item.mode !== 'slot'">
          <!-- 输入框，文本域 -->
          <el-input v-if="item.component === 'el-input'" v-model.trim="modelValueTmp[item.prop]" v-bind="item"></el-input>
          <!-- 选择器 -->
          <el-select v-else-if="item.component === 'el-select'" v-model="modelValueTmp[item.prop]" v-bind="item">
            <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
          </el-select>
          <!-- 单选组 -->
          <el-radio-group v-else-if="['el-radio', 'el-radio-button'].includes(item.component)" v-model="modelValueTmp[item.prop]" v-bind="item">
            <component :is="item.component" v-for="option in item.options" :key="option.label" :label="option.label" >{{ option.content || '' }}</component>
          </el-radio-group>
          <!-- 多选组 -->
          <el-checkbox-group v-else-if="['el-checkbox', 'el-checkbox-button'].includes(item.component)" v-model="modelValueTmp[item.prop]" v-bind="item">
            <component :is="item.component" v-for="option in item.options" :key="option.label" :label="option.label" >{{ option.content || '' }}</component>
          </el-checkbox-group>
          <!-- 其他 -->
          <component v-else :is="item.component" v-model="modelValueTmp[item.prop]" v-bind="item">
            <slot></slot>
          </component>
        </template>
        <template v-else>
          <slot :name="item.prop" v-bind="item"></slot>
        </template>
      </el-form-item>
    </template>
  </el-form>
  <slot name="footer"></slot>
</template>

<script>
import { defineComponent, nextTick, ref, watch } from 'vue'
/**
 * 可以 使用 component 组件的
 * input inputNumber cascader switch
 * slider timePicker
 * datePicker dateTimePicker, timeSelect
 * upload rate
 * colorPcker
 * transfer
 * 而 radio checkbox select checkboxButton 一般在表单中都使用 xxx组，所以这些需要单独处理
 */
// 表单方法
// const methodArr = [
//   'validate',
//   'validateField',
//   'resetFields',
//   'clearValidate'
// ]
export default defineComponent({
  name: 'KForm',
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'config',
      validator: (val) => {
        return ['config', 'render'].includes(val)
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    formItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // 表单本身
    const elFormRef = ref(null)
    // 处理 form-item
    const formItemsTmp = ref(null)
    watch(() => props.formItems, (val) => {
      formItemsTmp.value = val.map(v => {
        // 驼峰 转 中划线
        return {
          ...v,
          ...(v.component ? { component: `el-${v.component.replace(/([a-z])([A-Z])/, '$1-$2').toLocaleLowerCase()}` } : null),
          ...(v.clearable === undefined ? { clearable: true } : null)
        }
      })
    }, { immediate: true, deep: true })
    // 处理 表单绑定值
    const modelValueTmp = ref(null)
    watch(() => props.modelValue, (val) => {
      modelValueTmp.value = val
    }, { immediate: true, deep: true })
    watch(modelValueTmp.value, (val) => {
      emit('update:modelValue', val)
    })
    return {
      elFormRef,
      modelValueTmp,
      formItemsTmp
    }
  }
})
</script>
