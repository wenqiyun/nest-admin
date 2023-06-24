<template>
  <div class="menu-form-wrap box-bg-color">
    <h3 class="menu__tip" v-if="!props.isButtonEdit">
      <span>菜单信息</span>
      <span>
        <el-button
          type="primary"
          size="small"
          v-perm="'system_menus:edit'"
          :disabled="isEditStatus || !currMenu.id"
          @click="addOrUpdate('edit')"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          size="small"
          v-perm="'system_menus:del'"
          :disabled="isEditStatus || !currMenu.id"
          @click="delEvent"
        >
          删除
        </el-button>
        <el-button size="small" v-perm="'system_menus:create'" @click="addOrUpdate('add')">添加</el-button>
      </span>
    </h3>

    <el-form
      ref="menuFormRef"
      class="menu-form"
      :model="menuForm"
      :rules="menuFormRules"
      label-width="100px"
      :disabled="!isEditStatus"
      v-loading="loading"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model.trim="menuForm.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="" v-if="!props.isButtonEdit">
        <el-button type="primary" text @click="isShowChecked = true">{{
          parentMenuMap[menuForm.parentId as string]?.name || '无'
        }}</el-button>
      </el-form-item>
      <el-form-item label="唯一编码" prop="code">
        <el-input v-model.trim="menuForm.code" placeholder="唯一标识"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type" v-if="!props.isButtonEdit">
        <el-select v-model="menuForm.type" placeholder="请选择类型" style="width: 250px">
          <el-option label="菜单" :value="1"></el-option>
          <el-option label="标签页" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限集合">
        <ApiPermsSelect v-model="currApiPerms"></ApiPermsSelect>
      </el-form-item>
      <el-form-item label="排序" prop="">
        <el-input-number
          v-model.number="menuForm.orderNum"
          :min="0"
          :max="3000"
          :step="1"
          :precision="0"
          step-strictly
        ></el-input-number>
      </el-form-item>
      <div class="menu-form-action" v-show="isEditStatus && !isButtonEdit">
        <el-button @click="cancelAddOrEdit">取消</el-button>
        <el-button type="primary" @click="confirmEvent">确认</el-button>
      </div>
    </el-form>

    <ParentMenuTree
      v-model="isShowChecked"
      :curr-parentId="menuForm.parentId"
      @change="checkedParentEvent"
    ></ParentMenuTree>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType, watch } from 'vue'
import { ElMessage } from 'element-plus'

import ParentMenuTree from './ParentMenuTree.vue'
import ApiPermsSelect from './ApiPermsSelect.vue'

import {
  getOneMenuPerms,
  updateMenu,
  type ICreateOrUpdateMenu,
  type MenuApiResult,
  type MenuPermApiResult,
  createMenu,
  delMenu
} from '@/api/menu'
import { confirmElBox } from '@/utils'

const props = defineProps({
  currMenu: {
    type: Object as PropType<ICreateOrUpdateMenu | MenuApiResult>,
    default: () => {
      return {}
    }
  },
  menuList: {
    type: Array as PropType<MenuApiResult[]>,
    default: () => []
  },
  menuTree: {
    type: Array as PropType<MenuApiResult[]>,
    default: () => []
  },
  isButtonEdit: {
    type: Boolean,
    default: false
  }
})

const parentMenuMap = ref<Record<string, MenuApiResult>>({})
watch(
  () => props.menuList,
  () => {
    props.menuList.forEach((menu) => {
      parentMenuMap.value[menu.id] = menu
    })
  }
)

// 表单操作
const menuFormRef = ref() // 表单实例
const isEditStatus = ref<boolean>(false)

// 表单详情
const menuFormRules = ref({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入唯一编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
})

const menuForm = ref<ICreateOrUpdateMenu>({ parentId: '', name: '', code: '', type: '', orderNum: 0 })

// 当前 菜单 接口权限
const currApiPerms = ref<string[]>([])
const menuPermMap = ref<Record<string, string[]>>({})
const getCurrMenuPermListApi = async (id: string) => {
  const res = await getOneMenuPerms(id)
  if (res?.code === 200) {
    const permList = res.data as MenuPermApiResult[]
    menuPermMap.value[id] = permList.map((perm) => `${perm.apiMethod.toUpperCase()},${perm.apiUrl}`)
    currApiPerms.value = menuPermMap.value[id]
  }
}

watch(
  () => props.currMenu,
  () => {
    if (props.currMenu?.id || props.currMenu.parentId) {
      menuForm.value = JSON.parse(JSON.stringify(props.currMenu))
      menuFormRef.value?.clearValidate()
      props.currMenu?.id && getCurrMenuPermListApi(props.currMenu?.id as string)
    } else {
      menuFormRef.value?.resetFields()
    }
    if (props.isButtonEdit) {
      isEditStatus.value = true
    }
  },
  {
    immediate: true
  }
)

// 选择父级菜单
const isShowChecked = ref<boolean>(false)
const checkedParentEvent = (parentId: string) => {
  menuForm.value.parentId = parentId
}

// 编辑
const addOrUpdate = (type: 'edit' | 'add') => {
  if (type === 'add') {
    currApiPerms.value = []
    menuForm.value = {
      parentId: props.currMenu?.id || '0',
      name: '',
      code: '',
      type: '',
      orderNum: 0
    } as ICreateOrUpdateMenu
  }
  isEditStatus.value = true
}

// 取消
const cancelAddOrEdit = () => {
  menuForm.value = props.currMenu as ICreateOrUpdateMenu
  isEditStatus.value = false
  currApiPerms.value = menuPermMap.value[String(menuForm.value.id)]
  menuFormRef.value.clearValidate()
}

const emit = defineEmits(['change'])
const loading = ref<boolean>(false)
// 创建 / 更新 请求
const createOrUpdateMenuApi = async () => {
  const req: ICreateOrUpdateMenu = {
    ...menuForm.value,
    menuPermList: currApiPerms.value.map((curr) => {
      const permObjArr = curr.split(',')
      return { apiMethod: permObjArr[0], apiUrl: permObjArr[1] } as MenuPermApiResult
    })
  }
  req.parentId = req.parentId || '0'
  let res
  loading.value = true
  if (req.id) {
    delete req.children
    res = await updateMenu(req)
  } else {
    res = await createMenu(req)
  }
  loading.value = false
  if (res?.code === 200) {
    ElMessage({ message: `${req.id ? '更新' : '创建'}成功`, type: 'success' })
    isEditStatus.value = false
    emit('change')
  } else {
    ElMessage({ message: res.msg, type: 'error' })
  }
}
const confirmEvent = () => {
  menuFormRef.value?.validate((valid: boolean) => {
    valid && createOrUpdateMenuApi()
  })
}

// 删除
const delEvent = () => {
  confirmElBox(`此操作将会永久删除【${props.currMenu.name}】菜单，是否继续`, async () => {
    const res = await delMenu(props.currMenu.id as string)
    if (res?.code === 200) {
      ElMessage({ message: `菜单【${props.currMenu.name}】删除成功`, type: 'success' })
      emit('change')
    } else {
      ElMessage.error(res?.msg || '网络异常，请稍后重试')
    }
  })
}

defineExpose({
  createOrUpdateMenuApi
})
</script>

<style lang="scss" scoped>
.menu-form-wrap {
  width: 100%;
  height: 410px;

  .menu-form {
    width: 400px;
    padding-top: 10px;

    .menu-form-action {
      text-align: right;
    }
  }
}
</style>
