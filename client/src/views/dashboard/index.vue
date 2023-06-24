<template>
  <div class="dashboard-container">
    <div class="grow-card-wrapper">
      <el-row :gutter="12">
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <grow-card title="总用户数" icon="user" :count="800000" :increase="2.4" comparison-type="环比"></grow-card>
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <grow-card title="总产品数" icon="product" :count="2000" :increase="3" comparison-type="同比"></grow-card>
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <grow-card
            title="总营收额"
            icon="chart-line"
            :count="3200000"
            :increase="-2"
            comparison-type="环比"
          ></grow-card>
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <grow-card title="总任务数" icon="time" :count="10000" :increase="-1" comparison-type="同比"></grow-card>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-row :gutter="12">
        <el-col :span="16" :xs="24" :sm="24" :lg="16">
          <Charts classes="box-bg-color" :options="lineChartOptions" height="400px"></Charts>
          <div style="margin-top: 12px">
            <el-row :gutter="12">
              <el-col :span="12">
                <Charts classes="box-bg-color" :options="pieOptions" height="280px"></Charts>
                <!-- <chart-pie v-bind="pieDemoData" height="280px"></chart-pie> -->
              </el-col>
              <el-col :span="12">
                <Charts classes="box-bg-color" :options="barOptions" height="280px"></Charts>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :lg="8">
          <div class="product-demo box-bg-color">
            <h3 class="product_tip">项目进度</h3>
            <product-card v-for="product in productionDemoData" v-bind="product" :key="product.guid"></product-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Charts from '_c/Charts/index.vue'

import GrowCard from './components/GrowCard.vue'
import ProductCard from './components/ProductCard.vue'

const productionDemoData = [
  {
    guid: 1,
    title: '开发任务一',
    desc: '开发任务一简介',
    percent: 25,
    updateDate: '2020.06.12',
    userAvatar: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ]
  },
  {
    guid: 2,
    title: '开发任务二',
    desc: '开发任务二简介',
    percent: 65,
    updateDate: '2020.06.23',
    userAvatar: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ]
  },
  {
    guid: 3,
    title: '开发任务三',
    desc: '开发任务三简介',
    percent: 85,
    updateDate: '2020.07.12',
    userAvatar: [
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    ]
  }
]

const lineChartOptions = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}

const pieOptions = {
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

const barOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220]
    }
  ]
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0;

  .grow-card-wrapper {
    .grow-card {
      margin-bottom: 12px;
    }
  }

  :deep(.echart-container) {
    border-radius: 4px;
    box-shadow: 6px 6px 54px 0 rgba(0, 0, 0, 0.05);
  }

  .product-demo {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    box-shadow: 6px 6px 54px 0 rgba(0, 0, 0, 0.05);
    padding: 5px;

    .product_tip {
      display: flex;
      height: 32px;
      margin-bottom: 10px;
      justify-content: space-between;
      align-items: center;
      padding-left: 7px;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
  }
}

@media only screen and (max-width: 1200px) {
  .dashboard-container .product-demo {
    margin-top: 12px;
  }
}

@media only screen and (min-width: 1200px) {
  .dashboard-container .product-demo {
    margin-top: 0;
  }
}
</style>
