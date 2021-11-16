<template>
  <div class="product-card">
    <div class="product-card__header">
      <div class="product__info">
        <div class="product__title">{{ title }}</div>
        <div class="product__desc">{{ desc }}</div>
      </div>
    </div>
    <div class="product-card__body">
      <div class="product__info-progress">
        <span>进度</span>
        <span>{{ `${percent}%`  }}</span>
      </div>
      <div class="product__progress">
        <el-progress :stroke-width="8" :show-text="false" :color="customColors" :percentage="percent"></el-progress>
      </div>
    </div>
    <div class="product-card__footer">
      <div class="product__user">
        <div class="product-update">
          更新日期：
          <span>{{ updateDate }}</span>
        </div>
        <div>
          <el-avatar class="product__user-avatar" size="small" v-for="(user,i) in avatars" :src="user" :key="i" />
          <el-avatar class="product__user-avatar" size="small" v-if="userAvatar.length > 2">{{`+${userAvatar.length - 2}`}}</el-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    percent: Number,
    updateDate: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  computed: {
    avatars () {
      if (this.userAvatar.length > 2) {
        return this.userAvatar.filter((v, i) => i < 2)
      }
      return this.userAvatar
    }
  }
})
</script>

<style lang="scss" scoped>
.product-card {
  padding: 24px 20px 12px 16px;
  margin: 0 12px 12px 12px;
  border: 1px solid #ececf2;
  border-radius: 12px;
  height: 199px;
}
.product-card__header {
  width: 100%;
}
.product__title {
  font-size: 16px;
  line-height: 24px;
}
.product__desc {
  font-size: 12px;
  line-height: 21px;
  color: #8181a5;
}
.product-card__body {
  margin-top: 20px;
}
.product-card__footer {
  width: 100%;
  margin-top: 16px;
}
.product-update {
  font-size: 14px;
  line-height: 21px;
  span {
    font-size: 12px;
    color: #7c8087;
  }
}
.product__user {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product__info-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 21px;
  color: #8181a5;
}
.product__user-avatar {
  margin-right: 5px;
  &:last-child {
    margin-right: 0
  }
}
</style>
