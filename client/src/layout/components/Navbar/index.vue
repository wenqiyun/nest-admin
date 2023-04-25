<template>
  <div class="navbar">
    <Hamburger :is-active="sidebar.opened" class="hamburger-container" @toggle-click="toggleSidebar" />
    <Breadcrumb class="breadcrumb" />
    <div class="right-menu">
      <ThemeSwitch class="right-menu-item" />
      <el-dropdown class="right-menu-item">
        <div class="right-menu-avatar">
          <el-avatar v-if="userStore.userInfo?.avatar" :src="userStore.userInfo?.avatar" :size="30" />
          <el-avatar v-else :icon="UserFilled" :size="30" />
          <span>{{ userStore.userInfo?.account }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <a target="_blank" href="https://wenqiyun.gitee.io/nest-admin/#/">
              <el-dropdown-item>文档</el-dropdown-item>
            </a>
            <a target="_blank" href="https://github.com/wenqiyun/nest-admin">
              <el-dropdown-item>GitHub</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/wenqiyun/nest-admin">
              <el-dropdown-item>Gitee</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import Hamburger from '../Hamburger/index.vue'
import Breadcrumb from '../Breadcrumb/index.vue'
import { clearLocalStorage } from '@/utils/cache'

const appStore = useAppStore()
const sidebar = computed(() => {
  return appStore.sidebar
})

const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

const userStore = useUserStore()
const logout = () => {
  ElMessageBox.confirm('是否确认退出当前登录', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    clearLocalStorage()
    window.location.reload()
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: var(--navigationbar-height);
  overflow: hidden;
  background: #fff;
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: var(--navigationbar-height);
    float: left;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    float: left;
    // 参考 Bootstrap 的响应式设计 WIDTH = 576
    @media screen and (max-width: 576px) {
      display: none;
    }
  }

  .right-menu {
    float: right;
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #606266;

    &-item {
      padding: 0 10px;
      cursor: pointer;
      .right-menu-avatar {
        display: flex;
        align-items: center;
        .el-avatar {
          margin-right: 10px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
