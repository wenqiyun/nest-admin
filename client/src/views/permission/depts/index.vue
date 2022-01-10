<template>
  <div class="depts-container">
    <dept-tree @node-click="selectChangeEvent" v-loading="loading"></dept-tree>
    <div class="dept-content">
      <dept-edit :curr="currDept" @change="deptChange"></dept-edit>
      <dept-user-list></dept-user-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import { ElMessage } from 'element-plus'

import DeptTree from './components/DeptTree.vue'
import DeptEdit from './components/DeptEdit.vue'
import DeptUserList from './components/DeptUserList.vue'

import { arrToTree } from '@/utils'
import { DeptApiResult, DeptTreeName, getDeptList, ICreateOrUpdateDept } from '@/api/dept'

export default defineComponent({
  components: { DeptTree, DeptEdit, DeptUserList },
  setup () {
    const loading = ref<boolean>(false)
    // 查询所有部门集合，并将转换成 tree json 结构
    const deptTree = ref<DeptApiResult[]>([])
    const getAllDept = async () => {
      loading.value = true
      const res = await getDeptList()
      loading.value = false
      if (res?.code === 200) {
        const deptList = res.data as DeptApiResult[]
        deptTree.value = arrToTree(deptList, { root: '0', pidKey: 'parentId' })
      } else {
        ElMessage({ type: 'error', message: res?.msg || '网络异常，请稍后重试' })
      }
    }
    getAllDept()
    provide(DeptTreeName, deptTree)

    // 点击左侧树 node 事件
    const currDept = ref<ICreateOrUpdateDept>({})
    const selectChangeEvent = (data: DeptApiResult) => {
      currDept.value = data as ICreateOrUpdateDept
    }

    //
    const deptChange = () => {
      getAllDept()
      currDept.value = {}
    }

    return {
      loading,
      currDept,
      selectChangeEvent,
      deptChange
    }
  }
})
</script>

<style lang="scss" scoped>
.depts-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  background: rgba(245, 245, 245, .6);
}
.dept-content {
  width: calc(100% - 210px);
  margin-left: 10px;
  height: 100%;
}
</style>
