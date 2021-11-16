<template>
  <div class="grow-card">
    <div class="grow-card__header">
      <div class="grow-card__info">
        <p class="grow-card__title">{{ title }}</p>
        <k-count-to :end="count" :simplify="String(count).length > 6" usegroup :delay="4" countClass="grow-card__conuntto"></k-count-to>
      </div>
      <div class="grow-card__icon">
        <svg-icon :icon-class="icon"></svg-icon>
      </div>
    </div>
    <div class="grow-card__footer">
      <svg-icon :icon-class="increaseIcon"></svg-icon>
      <span class="grow-card__increasetext" :class="increase > 0 ? 'ascent-color' : 'decline-color'">
        <span>{{increaseText.intNum}}</span>
        <span v-if="increaseText.decimalNum" style="font-size: 16px;">{{ `.${increaseText.decimalNum}` }}</span>
      </span>
      <span class="grow-card__increasetip">{{ `${comparisonType}${increase > 0 ? '上升' : '下降'}` }}</span>
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
    count: {
      type: Number,
      default: 0
    },
    icon: String,
    increase: {
      type: Number,
      default: 0
    },
    comparisonType: {
      type: String,
      validator: (val) => {
        return ['环比', '同比'].includes(val)
      }
    },
    countToOptions: Object
  },
  computed: {
    increaseIcon () {
      return this.increase > 0 ? 'ascent' : 'decline'
    },
    increaseText () {
      const numText = String(Math.abs(this.increase))
      const index = numText.indexOf('.')
      const res = {
        decimalNum: '',
        intNum: ''
      }
      if (index > -1) {
        res.intNum = numText.substring(0, index)
        res.decimalNum = numText.substring(index + 1, numText.length)
        return res
      }
      res.intNum = numText
      return res
    }
  }
})
</script>

<style lang="scss" scoped>
.grow-card {
  width: 100%;
  padding: 16px 16px 12px 16px;
  background-color: #fff;
  height: 158px;
  border-radius: 4px;
  box-shadow: 6px 6px 54px 0 rgba(0,0,0,.05);
  flex-direction: column;
}
.grow-card__header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-content: space-between;
}
.grow-card__info {
  display: flex;
  flex-wrap: wrap;

  .count-to {
    width: 100%
  }
}
.grow-card__title {
  width: 100%;
  font-size: 16px;
  letter-spacing: 0;
}
.grow-card__icon {
  font-size: 70px;
}
:deep(.grow-card__conuntto) {
  font-size: 26px;
  font-weight: 600;
  line-height: 38px;
}
.grow-card__footer {
  display: flex;
  width: 100%;
  margin-top: 24px;
  align-items: center;
  font-size: 14px;
}
.grow-card__increasetext {
  margin-left: 5px;
  font-size: 24px;
}
.grow-card__increasetip {
  display: inline-block;
  padding-left: 10px;
  font-size: 12px;
  line-height: 22px;
  letter-spacing: 0;
  color: #606060;
}
.ascent-color {
  color: #55d187;
}
.decline-color {
  color: #ed6f6f;
}
</style>
