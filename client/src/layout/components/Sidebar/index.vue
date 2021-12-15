<template>
  <div class="sidebar-container">
    <Logo :collapse="isCollapse"></Logo>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        class="nest-menu"
        >
        <sidebar-item v-for="route in permRoutes" :key="route.path" :item="route" :base-path="route.path"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
// import _variables from '../../../styles/variables.scss'

export default defineComponent({
  name: 'Sidebar',
  components: { Logo, SidebarItem },
  setup () {
    const store = useStore()
    const permRoutes = computed(() => store.state.permission.routes)

    const activeMenu = computed(() => {
      const route = useRoute()
      const { meta, path } = route
      if (meta.activeMenu) return meta.activeMenu
      return path
    })

    const isCollapse = computed(() => !store.state.app.sidebar.opened)

    // console.log(_variables, 878)

    return {
      permRoutes,
      activeMenu,
      isCollapse,
      variables: {
        menuBg: '#304156',
        menuText: '#bfcbd9',
        menuActiveText: '#409EFF'
      }
    }
  }
})
</script>
