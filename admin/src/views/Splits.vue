<template>
  <div class="splits">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>平台收入</template>
          <div class="stat-value" style="color: #C53D13;">¥ {{ platformAmount }}</div>
          <div class="stat-rate">占比 30%</div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>技师收入</template>
          <div class="stat-value" style="color: #52C41A;">¥ {{ techAmount }}</div>
          <div class="stat-rate">占比 50%</div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>托管方收入</template>
          <div class="stat-value" style="color: #1890FF;">¥ {{ depositAmount }}</div>
          <div class="stat-rate">占比 20%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分账明细 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分账明细</span>
          <el-button type="primary" @click="handleExport">导出报表</el-button>
        </div>
      </template>

      <el-table :data="splitList" style="width: 100%">
        <el-table-column prop="writeOffNo" label="核销单号" width="180" />
        <el-table-column prop="orderAmount" label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.orderAmount }}
          </template>
        </el-table-column>
        
        <el-table-column prop="techAmount" label="技师收入" width="120">
          <template #default="{ row }">
            <span style="color: #52C41A;">¥{{ row.techAmount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="depositAmount" label="托管方收入" width="120">
          <template #default="{ row }">
            <span style="color: #1890FF;">¥{{ row.depositAmount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="platformAmount" label="平台收入" width="120">
          <template #default="{ row }">
            <span style="color: #C53D13;">¥{{ row.platformAmount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="splitTime" label="分账时间" width="180" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="success">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const platformAmount = ref('37,680.00')
const techAmount = ref('62,800.00')
const depositAmount = ref('25,120.00')

const splitList = ref([
  { writeOffNo: 'WO202403150001', orderAmount: 300, techAmount: 150, depositAmount: 60, platformAmount: 90, splitTime: '2024-03-15 14:35:20', status: '成功' },
  { writeOffNo: 'WO202403150002', orderAmount: 350, techAmount: 175, depositAmount: 70, platformAmount: 105, splitTime: '2024-03-15 14:32:10', status: '成功' },
  { writeOffNo: 'WO202403150003', orderAmount: 280, techAmount: 140, depositAmount: 56, platformAmount: 84, splitTime: '2024-03-15 14:28:45', status: '成功' }
])

const handleExport = () => {
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  margin: 20px 0;
}

.stat-rate {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
