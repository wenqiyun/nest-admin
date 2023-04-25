<template>
  <el-scrollbar ref="scrollbarRef" class="scroll-container">
    <div ref="scrollbarContentRef" class="scrollbar-content"><slot /></div>
  </el-scrollbar>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  width: 100%;
  :deep(.el-scrollbar) {
    flex: 1;
    // 横向超出窗口长度时，显示滚动条
    white-space: nowrap;
    .scrollbar-content {
      display: inline-block;
    }
  }
}
</style>
