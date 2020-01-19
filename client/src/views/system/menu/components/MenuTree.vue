<template>
  <el-dialog title="选择上级部门" top="5vh" width="300px" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-tree :data="menuTree" highlight-current default-expand-all node-key="id" :props="{ label: 'name' }" @node-click="treeNodeClickEvent"></el-tree>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    menuTree: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      menuId: 0
    }
  },
  methods: {
    confirmEvent () {
      this.$emit('input', this.menuId)
      this.handleClose()
    },
    treeNodeClickEvent (data) {
      this.menuId = data.menuId
    },
    handleClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
