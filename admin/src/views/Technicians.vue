<template>
  <div class="technicians">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="技师姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待审核" value="0" />
            <el-option label="已通过" value="1" />
            <el-option label="已拒绝" value="2" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="success" @click="handleAdd">新增技师</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 技师列表 -->
    <el-card>
      <el-table :data="technicianList" style="width: 100%">
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="certNo" label="资格证号" width="180" />
        <el-table-column prop="workYears" label="从业年限" width="100">
          <template #default="{ row }">
            {{ row.workYears }}年
          </template>
        </el-table-column>
        
        <el-table-column prop="ratingScore" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.ratingScore" disabled show-score />
          </template>
        </el-table-column>
        
        <el-table-column prop="orderCount" label="接单数" width="100" />
        
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="{ row }">
            <span style="color: #C53D13;">¥{{ row.balance }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="success" link size="small" v-if="row.status === 0">通过</el-button>
            <el-button type="danger" link size="small" v-if="row.status === 0">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  name: '',
  status: ''
})

const technicianList = ref([
  { id: 1, realName: '王师傅', certNo: 'TECH2024001', workYears: 5, ratingScore: 4.9, orderCount: 156, balance: 8960, status: 1 },
  { id: 2, realName: '李师傅', certNo: 'TECH2024002', workYears: 3, ratingScore: 4.8, orderCount: 89, balance: 7520, status: 1 },
  { id: 3, realName: '张师傅', certNo: 'TECH2024003', workYears: 2, ratingScore: 4.5, orderCount: 45, balance: 3200, status: 0 }
])

const statusType = (status) => {
  const map = { 0: 'warning', 1: 'success', 2: 'danger' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
  return map[status] || '未知'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleAdd = () => {
  ElMessage.info('新增技师功能开发中')
}
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}
</style>
