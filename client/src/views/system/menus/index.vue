<template>
  <div class="menu-container">
    <div class="menu-tree-wrapper">
      <el-scrollbar>
        <el-tree :data="menuTree" :props="{ label: 'name' }" node-key="id" highlight-current default-expand-all @node-click="menuClickEvent"></el-tree>
      </el-scrollbar>
    </div>
    <div class="menu-content">
      <menu-edit :curr-menu="currMenu" :all-menu="allMenu" @change="createOrUpdateSuccess"></menu-edit>
      <btn-list :curr-menu="currMenu"></btn-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { arrToTree } from '@/utils'
import { ICreateOrUpdateMenu, getAllMenu, MenuApiResult } from '@/api/menu'
import BtnList from './components/BtnList.vue'
import MenuEdit from './components/MenuEdit.vue'

export default defineComponent({
  components: { BtnList, MenuEdit },
  setup () {
    // 菜单树
    const menuTree = ref<Array<MenuApiResult>>([])
    const loading = ref<boolean>(false)
    const allMenu = ref<Array<MenuApiResult>>()
    const getAllMenuList = async () => {
      loading.value = true
      const res = await getAllMenu()
      if (res.code === 200) {
        allMenu.value = res.data as MenuApiResult[]
        menuTree.value = arrToTree(allMenu.value, { root: '0', pidKey: 'parentId' }) as MenuApiResult[]
        console.log(res.data, arrToTree(allMenu.value, { pidKey: 'parentId' }))
      }
      loading.value = false
    }

    // 初始化
    getAllMenuList()
    provide('menuTree', menuTree)
    const currMenu = ref<ICreateOrUpdateMenu>({ parentId: '', name: '', code: '', type: '', orderNum: '' })

    // 左侧菜单点击回调
    const menuClickEvent = (data: ICreateOrUpdateMenu) => {
      currMenu.value = data
    }

    const createOrUpdateSuccess = () => {
      getAllMenuList()
    }

    return {
      menuTree,
      menuClickEvent,
      allMenu,
      currMenu,
      createOrUpdateSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-container {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  background: rgba(245, 245, 245, .6);
}
.menu-tree-wrapper {
  width: 200px;
  height: 100%;
  padding-bottom: 20px;
  background: #fff;
  overflow: hidden;
}
.menu-content {
  width: calc(100% - 210px);
  margin-left: 10px;
  height: 100%;
}

</style>
