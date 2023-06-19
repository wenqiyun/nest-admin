<template>
  <div class="menu-container">
    <div class="menu-tree-wrap box-bg-color">
      <h3 class="menu__tip">
        <span>资源</span>
        <span>
          <el-input
            v-model.trim="keywords"
            placeholder="关键字搜索"
            size="small"
            style="width: 120px"
            clearable
          ></el-input>
        </span>
      </h3>
      <el-scrollbar>
        <el-tree
          ref="menuTreeRef"
          :data="menuTree"
          :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
          node-key="id"
          :filter-node-method="(val: any, data: any) => filterNode(val, data as MenuApiResult)"
          highlight-current
          default-expand-all
          @node-click="menuClickEvent"
        ></el-tree>
      </el-scrollbar>
    </div>

    <div class="menu-content">
      <Edit :curr-menu="currMenu" :menu-list="menuList" @change="menuUpdateEvent"></Edit>
      <BtnList :curr-menu="currMenu"></BtnList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, watch } from 'vue'

import Edit from './components/Edit.vue'
import BtnList from './components/BtnList.vue'

import { getAllMenu, type MenuApiResult, type ICreateOrUpdateMenu } from '@/api/menu'
import { listToTree } from '@/utils'

const menuTree = ref<MenuApiResult[]>([])
const loading = ref<boolean>(false)
const menuList = ref<MenuApiResult[]>()
const getMenuListApi = async () => {
  loading.value = true
  const res = await getAllMenu()
  loading.value = false
  if (res?.code === 200) {
    menuList.value = res.data as MenuApiResult[]
    menuTree.value = listToTree(menuList.value, { root: '0', pidKey: 'parentId' })
    // 判断是否是删除菜单更新，需要清空 当前
    if (menuList.value.findIndex((v) => v.id === currMenu.value.id) === -1) {
      currMenu.value = { parentId: '', name: '', code: '', type: '', orderNum: '' }
    }
  }
}
getMenuListApi()

// 左侧关键字搜索
const menuTreeRef = ref()
const keywords = ref<string>('')
const filterNode = (value: string, data: MenuApiResult): boolean => {
  if (!value) return true
  return data.name?.includes(value) || false
}
watch(
  () => keywords.value,
  () => {
    menuTreeRef.value.filter(keywords.value)
  }
)
provide('menuTree', menuTree)
const currMenu = ref<ICreateOrUpdateMenu>({ parentId: '', name: '', code: '', type: '', orderNum: '' })
const menuClickEvent = (data: ICreateOrUpdateMenu) => {
  currMenu.value = data
}

const menuUpdateEvent = () => {
  getMenuListApi()
}
</script>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  padding: 0;

  .menu-tree-wrap {
    width: 200px;
    height: 100%;
    overflow: hidden;
  }
}
:deep(.menu__tip) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 1px 1px 0 0 var(--line-color);
  // 阴影部分显示
  margin-bottom: 1px;
}

.menu-content {
  width: calc(100% - 207px);
  margin-left: 7px;
}
</style>
