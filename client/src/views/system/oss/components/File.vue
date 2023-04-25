<template>
  <div class="file-wrap">
    <el-image
      fit="contain"
      style="width: 100px; height: 100px"
      :src="file.url"
      v-if="fileType === 'image'"
      :preview-src-list="[file.url]"
      preview-teleported
      lazy
    >
      <template #error>
        <div class="image-error">
          <el-icon><icon-picture /></el-icon>
        </div>
      </template>
    </el-image>
    <svg-icon :name="`file-${fileType}`" v-else></svg-icon>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'

import type { OssApiResult } from '@/api/oss'

const props = defineProps({
  file: {
    type: Object as PropType<OssApiResult>,
    default: () => ({})
  }
})

/**
 * 根据 mime type 判断文件类型，并返回统一数据
 * 图片 则返回 image
 * pptx ppt 返回 ppt
 * xls xlsx 返回 excel
 */
const fileType = computed(() => {
  const mimeType = props.file.type
  if (/image\/.*$/.test(mimeType)) {
    return 'image'
  } else if (
    ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)
  ) {
    return 'doc'
  } else if (
    [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ].includes(mimeType)
  ) {
    return 'ppt'
  } else if (
    ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(mimeType)
  ) {
    return 'excel'
  } else if (mimeType === 'text/plain') {
    return 'txt'
  } else if (mimeType === 'application/pdf') {
    return 'pdf'
  }

  return 'other'
})

console.log(fileType)
</script>

<style lang="scss" scoped>
.file-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 50px;

  .image-error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
  }
}
</style>
