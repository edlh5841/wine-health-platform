<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2>🍷 保健酒平台</h2>
      <p>管理后台登录</p>
      
      <el-form :model="form" @keyup.enter="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" :prefix-icon="Lock" />
        </el-form-item>
        
        <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
      </el-form>
      
      <p class="tips">测试账号：admin / admin123</p>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  if (form.username === 'admin' && form.password === 'admin123') {
    ElMessage.success('登录成功')
    router.push('/')
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  text-align: center;
}

.login-box h2 {
  margin: 0 0 10px;
  color: #C53D13;
}

.tips {
  margin-top: 20px;
  color: #999;
  font-size: 14px;
}
</style>
