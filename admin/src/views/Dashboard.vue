<template>
  <div class="dashboard">
    <!-- 顶部指标卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in metricCards" :key="card.title">
        <el-card class="metric-card" :style="{ borderLeft: `4px solid ${card.color}` }">
          <div class="card-content">
            <div class="card-info">
              <p class="card-title">{{ card.title }}</p>
              <p class="card-value">{{ card.value }}</p>
            </div>
            <div class="card-icon" :style="{ backgroundColor: card.color + '20' }">
              <el-icon :size="32" :color="card.color"><component :is="card.icon" /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>GMV趋势（今日）</span>
          </template>
          <div ref="gmvChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>技师收入TOP10</span>
          </template>
          <div ref="rankChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时订单 -->
    <el-card class="order-stream">
      <template #header>
        <div class="card-header">
          <span>实时订单流</span>
          <el-tag type="success">● 实时更新</el-tag>
        </div>
      </template>
      
      <el-table :data="realtimeOrders" style="width: 100%">
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="amount" label="金额">
          <template #default="{ row }">
            <span style="color: #C53D13; font-weight: bold;">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="area" label="区域" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const gmvChart = ref(null)
const rankChart = ref(null)

const metricCards = ref([
  { title: '今日GMV', value: '¥125,680', icon: 'Money', color: '#C53D13' },
  { title: '今日订单', value: '256', icon: 'ShoppingCart', color: '#52C41A' },
  { title: '活跃技师', value: '48', icon: 'User', color: '#1890FF' },
  { title: '库存预警', value: '3', icon: 'Warning', color: '#FAAD14' }
])

const realtimeOrders = ref([
  { time: '14:32', orderNo: 'W202403150001', amount: 300, status: '已完成', area: '朝阳区' },
  { time: '14:28', orderNo: 'W202403150002', amount: 350, status: '服务中', area: '海淀区' },
  { time: '14:25', orderNo: 'W202403150003', amount: 280, status: '待服务', area: '东城区' }
])

const statusType = (status) => {
  const map = { '已完成': 'success', '服务中': 'primary', '待服务': 'warning' }
  return map[status] || 'info'
}

onMounted(() => {
  // GMV趋势图
  const gmvChartInstance = echarts.init(gmvChart.value)
  gmvChartInstance.setOption({
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] },
    yAxis: { type: 'value' },
    series: [{
      data: [12000, 15000, 28000, 45000, 68000, 125680],
      type: 'line',
      smooth: true,
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
        { offset: 0, color: 'rgba(197, 61, 19, 0.3)' },
        { offset: 1, color: 'rgba(197, 61, 19, 0.05)' }
      ]}}
    }]
  })

  // 技师排行图
  const rankChartInstance = echarts.init(rankChart.value)
  rankChartInstance.setOption({
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['张师傅', '李师傅', '王师傅', '赵师傅', '刘师傅'] },
    series: [{
      type: 'bar',
      data: [8960, 7520, 6890, 5230, 4560],
      itemStyle: { color: '#C53D13' }
    }]
  })
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.metric-card {
  margin-bottom: 20px;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin: 0 0 10px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-row {
  margin-bottom: 20px;
}

.order-stream {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
