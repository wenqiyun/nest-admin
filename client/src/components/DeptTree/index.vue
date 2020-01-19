<template>
  <el-dialog title="选择上级部门" top="5vh" width="300px" :visible.sync="visible" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <div style="min-height: 400px;">
      <el-tree ref="parent_dept_tree" :data="deptTree" highlight-current default-expand-all node-key="deptId" :props="{ label: 'name' }" @node-click="treeNodeClickEvent"></el-tree>
    </div>
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
      type: Number
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    deptTree: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dept: undefined
    }
  },
  watch: {
    visible (val) {
      this.$nextTick(() => {
        this.$refs['parent_dept_tree'] && this.$refs['parent_dept_tree'].setCurrentKey()
      })
    }
  },
  methods: {
    confirmEvent () {
      if (!this.dept) {
        this.$message.error('请选择当前上级部门')
        return
      }
      this.$emit('input', this.dept.deptId)
      this.$emit('checked-success', this.dept)
      this.handleClose()
    },
    treeNodeClickEvent (data) {
      this.dept = data
    },
    handleClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
