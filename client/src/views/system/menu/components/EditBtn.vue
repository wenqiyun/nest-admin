<template>
  <el-dialog title="编辑" top="10vh" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="loading">
    <el-form ref="btn_form" :model="btnForm" :rules="rules" label-width="100px">
      <el-form-item label="按钮名称：" prop="name">
        <el-input v-model="btnForm.name" placeholder="按钮名称"></el-input>
      </el-form-item>
      <el-form-item label="按钮标识：" prop="code">
        <el-input v-model="btnForm.code" placeholder="按钮标识, 菜单唯一标识:按钮动作，如：permission_depts:edit"></el-input>
      </el-form-item>
      <el-form-item label="授权集合：" prop="perms">
        <el-input v-model="btnForm.perms"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confoimEvent">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getBtnInfo, updateMenu, createMenu } from '@/api/sys.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idObj: {
      type: Object,
      required: true // menuId , btnId
    }
  },
  data () {
    return {
      loading: false,
      btnForm: {
        name: '',
        code: '',
        perms: '',
        type: 3,
        orderNum: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入按钮名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入按钮标识', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '请输入授权', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'idObj.btnId' (val) {
      this.btnForm = { name: '', code: '', perms: '', type: 3, orderNum: 1 }
      val && this.getBtnInfoFn()
    }
  },
  methods: {
    confoimEvent () {
      this.$refs['btn_form'].validate((valid) => {
        if (valid) {
          this.createOrUpdateMenuFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async createOrUpdateMenuFn () {
      this.loading = true
      let res
      if (this.btnForm.menuId) {
        res = await updateMenu(this.btnForm)
      } else {
        this.btnForm['parentId'] = this.idObj.menuId
        res = await createMenu(this.btnForm)
      }
      this.loading = false
      if (res.statusCode === 200) {
        this.$message.success(res.message)
        this.$parent.getBtnListFn()
        this.handleClose()
      } else {
        this.$message.info(res.message)
      }
    },
    async getBtnInfoFn () {
      this.loading = true
      const res = await getBtnInfo(this.idObj.btnId)
      this.loading = false
      if (res.statusCode === 200) {
        this.btnForm = res.data
      } else {
        this.$message.info(res.message)
      }
    },
    handleClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
