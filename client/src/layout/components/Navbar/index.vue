<template>
  <div class="navbar">
    <hamburger id="hamburger-container" class="hamburger-container" :is-active="sidebar.opened" @toggle-click="toggleSideBar"></hamburger>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @visible-change="visibleChange">
        <div class="avatar-wrapper">
          <el-avatar :src="userAvatar" fit="fill" class="user-avatar" shape="circle"></el-avatar>
          <div class="user-name-wrapper">
            <span>{{ userAccount }}</span>
            <svg-icon icon-class="arrow-down" :class="{ 'arrow-down': true, 'arrow-down-show': dropdownShow }"></svg-icon>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/wenqiyun/nest-admin">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <el-dropdown-item @click="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from '@/store'
import Hamburger from '_c/Hamburger/index.vue'
import Breadcrumb from '_c/Breadcrumb/index.vue'
import { clearAll } from '../../../utils/storage'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'Navbar',
  components: { Hamburger, Breadcrumb },
  setup () {
    const store = useStore()

    const sidebar = computed(() => store.state.app.sidebar)

    const userAvatar = computed(() => store.state.user.user.avatar)

    const userAccount = computed(() => store.state.user.user.account)

    const toggleSideBar = () => {
      store.dispatch('app/toggleSideBar')
    }

    const loginout = () => {
      ElMessageBox.confirm('是否确认退出当前登录', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearAll()
        window.location.reload()
      })
    }

    const dropdownShow = ref<boolean>(false)
    const visibleChange = (show: boolean) => {
      dropdownShow.value = show
    }

    return {
      sidebar,
      userAvatar,
      userAccount,
      toggleSideBar,
      loginout,
      dropdownShow,
      visibleChange
    }
  }
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  :deep(.right-menu) {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        line-height: 50px;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
        }

        .user-name-wrapper {
          margin-left: 10px;
        }
        .arrow-down {
          transition: all .28s;
        }
        .arrow-down-show {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
