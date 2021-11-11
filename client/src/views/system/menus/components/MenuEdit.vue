<template>
  <div class="menu-form-wrapper" >
    <div class="menu-action">
      <el-button type="primary" :disabled="isEditStatus || !currMenu?.id" @click="addOrUpdate('edit')">编辑</el-button>
      <el-button type="danger" :disabled="isEditStatus || !currMenu?.id" @click="delMenuFn">删除</el-button>
      <el-button :disabled="isEditStatus"  @click="addOrUpdate('add')">添加</el-button>
    </div>
    <el-form ref="menuFormRef" class="menu-form" :model="menuForm" :rules="menuFormRules" label-width="100px" :disabled="!isEditStatus">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model.trim="menuForm.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="">
        <el-button type="text" @click="isShowChecked = true">{{ menuObj[menuForm.parentId]?.name || '无' }}</el-button>
      </el-form-item>
      <el-form-item label="唯一编码" prop="code">
        <el-input v-model.trim="menuForm.code" placeholder="唯一标识"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="menuForm.type" placeholder="请选择类型" style="width: 250px;">
          <el-option label="菜单" :value="1"></el-option>
          <el-option label="标签页" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限集合">
        <api-perms-select v-model="currApiPerms"></api-perms-select>
      </el-form-item>
      <el-form-item label="排序" prop="">
        <el-input v-model.number="menuForm.orderNum" placeholder="排序"></el-input>
      </el-form-item>
      <div class="menu-form-action" v-show="isEditStatus">
        <el-button @click="cancelAddOrEdit">取消</el-button>
        <el-button type="primary" @click="createOrUpdateEvent">确认</el-button>
      </div>
    </el-form>

    <!-- 上级菜单选择 -->
    <check-menu-tree v-model="isShowChecked" @change="checkedParentId"></check-menu-tree>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref, watch } from 'vue'
import { createMenu, delMenu, getOneMenuPerms, ICreateOrUpdateMenu, MenuApiResult, MenuPermApiResult, updateMenu } from '@/api/menu'
import CheckMenuTree from './CheckMenuTree.vue'
import ApiPermsSelect from './ApiPermsSelect.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: { CheckMenuTree, ApiPermsSelect },
  props: {
    currMenu: {
      type: Object as PropType<ICreateOrUpdateMenu>,
      default: () => {
        return {}
      }
    },
    allMenu: {
      type: Array,
      default: () => []
    },
    menuTree: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    // 当前选中 apiPerms
    const currApiPerms = ref<Array<string>>([])
    // 表单详情
    const menuForm = ref<ICreateOrUpdateMenu>({ parentId: '', name: '', code: '', type: '', orderNum: '' })

    // 获取父级菜单
    const menuObj = ref<Record<string, MenuApiResult>>({})
    watch(() => props.allMenu as Array<MenuApiResult>, (val) => {
      val.forEach(menu => {
        menuObj.value[String(menu.id)] = menu as MenuApiResult
      })
    })
    const menuPermObj = ref<Record<string, Array<string>>>({})
    const getOneMenuPermsFn = async (id: string) => {
      const res = await getOneMenuPerms(id)
      if (res.code === 200) {
        const permList = res.data as Array<MenuPermApiResult>
        menuPermObj.value[String(id)] = permList.map(perm => `${perm.apiMethod.toUpperCase()},${perm.apiUrl}`)
        currApiPerms.value = menuPermObj.value[String(id)]
      }
    }

    // 当前菜单改变
    watch(() => props.currMenu as ICreateOrUpdateMenu, (val: ICreateOrUpdateMenu) => {
      menuForm.value = val
      getOneMenuPermsFn(val.id as string)
    })

    // 表单操作
    const menuFormRef = ref() // 表单实例
    const isEditStatus = ref<boolean>(false)
    const addOrUpdate = (type: 'edit' | 'add') => {
      if (type === 'add') {
        menuForm.value = { parentId: props.currMenu?.id || 0, name: '', code: '', type: '', orderNum: '' } as ICreateOrUpdateMenu
      }
      isEditStatus.value = true
    }
    const cancelAddOrEdit = () => {
      menuForm.value = props.currMenu as ICreateOrUpdateMenu
      isEditStatus.value = false
      currApiPerms.value = menuPermObj.value[String(menuForm.value.id)]
      menuFormRef.value.clearValidate()
    }

    const isShowChecked = ref<boolean>(false)
    const checkedParentId = (menuId: string | number) => {
      menuForm.value.parentId = menuId
    }

    // 创建 / 更新 请求
    const createOrUpdateMenuFn = async () => {
      const req: ICreateOrUpdateMenu = {
        ...menuForm.value,
        menuPermList: currApiPerms.value.map(curr => {
          const permObjArr = curr.split(',')
          return { apiMethod: permObjArr[0], apiUrl: permObjArr[1] } as MenuPermApiResult
        })
      }
      req.parentId = req.parentId || '0'
      let res
      if (req.id) {
        res = await updateMenu(req)
      } else {
        res = await createMenu(req)
      }
      if (res.code === 200) {
        ElMessage({ message: `${req.id ? '更新' : '创建'}成功`, type: 'success' })
        isEditStatus.value = false
        emit('change')
      } else {
        ElMessage({ message: res.msg, type: 'error' })
      }
    }

    const delMenuFn = async () => {
      try {
        await ElMessageBox.confirm(`此操作将会永久删除【${props.currMenu.name}】菜单，是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await delMenu(props.currMenu.id as string)
        if (res.code === 200) {
          ElMessage({ message: `菜单【${props.currMenu.name}】删除成功`, type: 'success' })
          emit('change')
        } else {
          ElMessage({ message: res.msg, type: 'error' })
        }
      } catch (error) {}
    }

    const createOrUpdateEvent = () => {
      menuFormRef.value.validate((valid: boolean) => {
        if (valid) createOrUpdateMenuFn()
      })
    }

    const menuFormRules = ref({
      name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入唯一编码', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择类型', trigger: 'blur' }
      ]
    })

    return {
      menuObj,
      menuFormRef,
      menuFormRules,
      menuForm,
      currApiPerms,
      isEditStatus,
      addOrUpdate,
      cancelAddOrEdit,
      // 选择上级菜单相关
      isShowChecked,
      checkedParentId,
      createOrUpdateEvent,
      delMenuFn
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-form-wrapper {
  width: 100%;
  height: 420px;
  background: #fff;

  .menu-action {
    padding: 10px 20px;
  }
  .menu-form {
    width: 400px;
    margin-top: 10px;

    .menu-form-action {
      text-align: right;
    }
  }
}
</style>
