<template>
  <el-dialog
    title="编辑头像"
    v-model="visible"
    top="10vh"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    v-loading.fullscreen.lock="loading"
  >
    <div class="avatar-cropper-wrapper">
      <div class="avatar-cropper">
        <el-upload
          accept="image/png, image/jpeg, image/jpg"
          action=""
          v-show="!imgUrl"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="uploadClickEvent"
        >
          <el-button ref="avatarUploadBtnRef" type="primary">选择图片</el-button>
        </el-upload>
        <VueCropper
          ref="avatarCropperRef"
          v-show="imgUrl"
          :img="imgUrl"
          auto-crop
          fixed-box
          center-box
          :auto-crop-width="200"
          :auto-crop-height="200"
          @realTime="realTimeEvent"
        ></VueCropper>
      </div>
      <div class="avatar-preview">
        <div class="avatar-preview__item" v-for="(item, i) in previewStyle" :key="i" :style="item.style">
          <div v-show="imgUrl" :class="previews.div" class="avatar-preview__item-wrapper" :style="item.zoomStyle">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
        <div class="avatar-preview__tips">
          <el-button type="primary" text v-if="imgUrl" @click="uploadPreviewEvent">重新上传</el-button>
          <span v-else>预 览</span>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmUpload">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

import { UPDATE_MODEL_EVENT } from 'cm/contants'
import { fileUpload, type OssApiResult } from '@/api/oss'

const visible = ref<boolean>(false)

const emit = defineEmits([UPDATE_MODEL_EVENT, 'change'])

const handleClose = () => {
  emit(UPDATE_MODEL_EVENT, false)
}
const imgUrl = ref()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  avatarUrl: {
    type: String,
    default: ''
  }
})

const uploadClickEvent = (file: any) => {
  if ('image/png, image/jpeg, image/jpg'.indexOf(file.raw.type) === -1) {
    ElMessage({ type: 'error', message: '文件类型错误' })
    return false
  }
  if (file.raw.size > 1024 * 1024 * 5) {
    ElMessage({ type: 'error', message: '上传图片大小不能超过 5M' })
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = (e) => {
    imgUrl.value = e?.target?.result
  }
}

// 重新上传
const avatarUploadBtnRef = ref()
const uploadPreviewEvent = () => {
  avatarUploadBtnRef.value.$el.click()
}

// 实时预览
const previews = ref({
  url: '',
  img: '',
  div: ''
})
const realTimeEvent = (data: any) => {
  previews.value = data
}
// 预览样式
const previewStyle = [
  { style: { width: '108px', height: '108px', margin: '0 auto' }, zoomStyle: { zoom: 0.5 } },
  { style: { width: '68px', height: '68px', margin: '27px auto' }, zoomStyle: { zoom: 0.3 } },
  { style: { width: '48px', height: '48px', margin: '0 auto' }, zoomStyle: { zoom: 0.2 } }
]

// 确认上传
const avatarCropperRef = ref()
// 获取裁剪后的图片数据
const getCropBlob = (): Promise<Blob> => {
  return new Promise((resolve) => {
    avatarCropperRef.value.getCropBlob((data: Blob) => {
      resolve(data)
    })
  })
}
const loading = ref<boolean>(false)
const confirmUpload = async () => {
  loading.value = true
  const formData = new FormData()
  const cropData = await getCropBlob()
  formData.append('file', cropData)
  formData.append('business', '头像')
  const res = await fileUpload(formData)
  loading.value = false
  if (res?.code === 200) {
    const data = res.data as OssApiResult[]
    emit('change', data[0].url)
    handleClose()
  } else {
    ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试' })
  }
}

watch(
  () => props.modelValue,
  (val: boolean) => {
    visible.value = val
    if (val) {
      imgUrl.value = props.avatarUrl
    }
  }
)
</script>

<style lang="scss" scoped>
.avatar-cropper-wrapper {
  display: flex;

  .avatar-cropper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
    background-color: #f0f2f5;
    margin-right: 10px;
    border-radius: 4px;
  }

  .avatar-preview {
    width: 150px;
    height: 400px;
    background-color: #f0f2f5;
    border-radius: 4px;
    padding: 16px 0;

    &__item {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #fff;
      border-radius: 50%;

      &-wrapper {
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-radius: 50%;
      }
    }

    &__tips {
      text-align: center;
      margin-top: 50px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
