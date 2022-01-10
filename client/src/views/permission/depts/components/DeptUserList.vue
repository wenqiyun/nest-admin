<template>
  <div class="dept-user-list">
    <!-- <k-table ></k-table> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const userList = ref([])
    return {
      userList
    }
  }
})
</script>

<style lang="scss" scoped>
.dept-user-list {
  width: 100%;
  height: calc(100% - 440px);
  margin-top: 10px;
  padding: 10px;
  background: #fff;
}
</style>
