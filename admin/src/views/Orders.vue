<template>
  <div class="orders">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待支付" value="0" />
            <el-option label="待服务" value="1" />
            <el-option label="服务中" value="2" />
            <el-option label="已完成" value="3" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <el-button type="primary" @click="handleExport">导出数据</el-button>
        </div>
      </template>

      <el-table :data="orderList" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="techName" label="技师" width="120" />
        <el-table-column prop="serviceType" label="服务类型" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            <span style="color: #C53D13;">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180" />
        
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="danger" link size="small" v-if="row.status === 0">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pageInfo.page"
        v-model:page-size="pageInfo.size"
        :total="pageInfo.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  orderNo: '',
  status: ''
})

const orderList = ref([
  { orderNo: 'W202403150001', userName: '张三', techName: '王师傅', serviceType: '推拿', amount: 300, status: 3, createTime: '2024-03-15 14:32:15' },
  { orderNo: 'W202403150002', userName: '李四', techName: '李师傅', serviceType: '理疗', amount: 350, status: 2, createTime: '2024-03-15 14:28:30' },
  { orderNo: 'W202403150003', userName: '王五', techName: '张师傅', serviceType: '推拿', amount: 280, status: 1, createTime: '2024-03-15 14:25:10' }
])

const pageInfo = reactive({
  page: 1,
  size: 10,
  total: 100
})

const statusType = (status) => {
  const map = { 0: 'warning', 1: 'primary', 2: 'success', 3: 'info' }
  return map[status] || 'info'
}

const statusText = (status) => {
  const map = { 0: '待支付', 1: '待服务', 2: '服务中', 3: '已完成' }
  return map[status] || '未知'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.status = ''
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleSizeChange = (size) => {
  pageInfo.size = size
}

const handlePageChange = (page) => {
  pageInfo.page = page
}
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
