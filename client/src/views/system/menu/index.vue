<template>
    <!-- 菜单树 -->
  <div class="menu-container" v-loading="loading">
    <div class="menu-tree-wrapper">
      <el-tree ref="menu_tree" :data="menuTree" highlight-current default-expand-all node-key="menuId" :props="{ label: 'name' }" @node-click="treeNodeClickEvent"></el-tree>
    </div>
    <!-- 基础信息和菜单按钮表 -->
    <div class="menu-main">
      <div class="menu-form-wrapper">
        <div class="menu-action">
          <el-button type="primary" @click="formType = 'edit'" :disabled="currentMenu.menuId === '' || formType === 'create'" v-perm="{ code: 'system_menu:edit' }">编辑</el-button>
          <el-button type="danger" @click="delMenuEvent" :disabled="currentMenu.menuId === ''" v-perm="{ code: 'system_menu:del' }">删除</el-button>
          <el-button @click="createMenuEvent" :disabled="currentMenu.menuId === '' || formType === 'edit'" v-perm="{ code: 'system_menu:create' }">添加</el-button>
          <div style="display: inline-block;margin-left: 10px;">
            <el-alert title="为了不影响系统的正常使用，请不要修改菜单按钮的授权集合，标识或做删除操作" type="warning" :closable="false"></el-alert>
          </div>
        </div>
        <el-form ref="menu_form" :model="currentMenu" :rules="rules" :disabled="formType === 'preview'" label-width="100px" style="width: 400px;margin-top:20px;">
          <el-form-item label="名称：" prop="name">
            <el-input v-model.trim="currentMenu.name" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单：">
            <el-button type="text" @click="isSelectedMenu = true">{{ menuObj[currentMenu.parentId] || '无' }}</el-button>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-select v-model="currentMenu.type" placeholder="选择类型">
              <el-option v-for="item in baseType" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input v-model.number="currentMenu.orderNum" placeholder="排序"></el-input>
          </el-form-item>
          <el-form-item label="标识：" prop="code">
            <el-input v-model.trim="currentMenu.code" placeholder="菜单标识"></el-input>
          </el-form-item>
          <el-form-item label="授权集合：" prop="perms">
            <el-input v-model.trim="currentMenu.perms" placeholder="授权集合"></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 400px;" v-show="formType !== 'preview'">
          <el-button type="primary" class="fr" @click="confirmEvent">确认提交</el-button>
          <el-button @click="handleCancelEvent" class="fr" style="margin-right: 10px;">取消</el-button>
        </div>
      </div>
      <!-- 菜单下的按钮列表 -->
      <btn-list :menuId="currentMenu.menuId" class="menu-btn-list"></btn-list>
    </div>

    <!-- 选择上级菜单 -->
    <menu-tree v-model="currentMenu.parentId" :visible.sync="isSelectedMenu" :menuTree="[{ menuId: 0, name: '顶级菜单（无上级）', children: this.menuTree }]"></menu-tree>
  </div>
</template>

<script>
import BtnList from './components/BtnList'
import MenuTree from './components/MenuTree'
import { arrToTree } from '@/utils/index.js'
import { getMenuNoBtnsList, updateMenu, createMenu, delMenu } from '@/api/sys.js'

export default {
  components: { BtnList, MenuTree },
  data () {
    return {
      loading: false,
      menuObj: {},
      menuTree: [],
      currentMenu: {
        menuId: '',
        parentId: '',
        name: '',
        orderNum: '',
        code: '',
        type: '',
        perms: ''
      },
      formType: 'preview', // edit , create
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入菜单唯一标识', trigger: 'blur' }
        ]
      },
      isSelectedMenu: false,
      baseType: [
        { label: '菜单/目录', value: 1 },
        { label: 'tabs 页面', value: 2 }
      ]
    }
  },
  created () {
    this.getMenuListFn()
  },
  methods: {
    delMenuEvent () {
      this.$confirm('删除按钮后，权限可能需要重新配置，是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delMenuFn()
      }).catch(() => {})
    },
    confirmEvent () {
      this.$refs['menu_form'].validate((valid) => {
        if (valid) {
          this.createOrUpdateMenuFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createMenuEvent () {
      this.currentMenu = { menuId: '', parentId: this.currentMenu.menuId, name: '', orderNum: 1, code: '', type: 1, perms: '' }
      this.formType = 'create'
    },
    handleCancelEvent () {
      this.$refs['menu_form'].clearValidate()
      this.currentMenu = Object.assign({}, this.$refs['menu_tree'].getCurrentNode())
      this.formType = 'preview'
    },
    treeNodeClickEvent (data) {
      this.currentMenu = Object.assign({}, data)
      // this.formType = 'preview'
    },
    async getMenuListFn () {
      this.loading = true
      // 重置数据
      this.currentMenu = { menuId: '', parentId: '', name: '', orderNum: '', code: '', type: '', perms: '' }
      this.formType = 'preview'
      const res = await getMenuNoBtnsList()
      this.loading = false
      if (res.statusCode === 200) {
        this.menuTree = arrToTree(res.data, { idKey: 'menuId', pidKey: 'parentId' })
        const menuObj = {}
        res.data.forEach(v => {
          menuObj[v.menuId] = v.name
        })
        this.menuObj = menuObj
        if (this.menuTree.length > 0) {
          this.$nextTick(() => {
            this.treeNodeClickEvent(this.menuTree[0])
            this.$refs['menu_tree'].setCurrentKey(this.menuTree[0].menuId)
          })
        }
      } else {
        this.$message.info(res.message)
      }
    },
    async createOrUpdateMenuFn () {
      this.loading = true
      const req = {
        parentId: this.currentMenu.parentId,
        name: this.currentMenu.name,
        orderNum: this.currentMenu.orderNum,
        code: this.currentMenu.code,
        type: this.currentMenu.type,
        perms: this.currentMenu.perms
      }
      let res
      if (this.formType === 'edit') {
        req['menuId'] = this.currentMenu.menuId
        res = await updateMenu(req)
      } else {
        res = await createMenu(req)
      }
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success(res.message)
        this.getMenuListFn()
      } else {
        this.$message.info(res.message)
      }
    },
    async delMenuFn () {
      this.loading = true
      const res = await delMenu(this.currentMenu.menuId)
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success('删除成功')
        this.getMenuListFn()
      } else {
        this.$message.info(res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  flex-wrap: nowrap;
}
.menu-tree-wrapper {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
}
.menu-main {
  width: calc(100% - 215px);
  margin-left: 15px;
  height: 100%;
}
.menu-form-wrapper {
  width: 100%;
  height: 420px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
  .menu-action {
    padding: 10px 20px;
  }
}
.menu-btn-list {
  margin-top: 15px;
  height: calc(100% - 435px);
  overflow-y: auto;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
}
</style>
