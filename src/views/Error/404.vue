<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
          <circle cx="70" cy="80" r="8" fill="#666"/>
          <circle cx="130" cy="80" r="8" fill="#666"/>
          <path d="M 70 130 Q 100 110 130 130" stroke="#666" stroke-width="3" fill="none"/>
          <text x="100" y="160" text-anchor="middle" font-size="14" fill="#999">404</text>
        </svg>
      </div>
      <h1 class="error-title">404</h1>
      <p class="error-desc">抱歉，您访问的页面不存在</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-content {
  text-align: center;
  padding: 40px;
}

.error-image {
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.error-title {
  font-size: 120px;
  font-weight: 700;
  color: #409eff;
  margin: 0 0 20px;
  text-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
}

.error-desc {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  
  .el-button {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .error-title {
    font-size: 80px;
  }
  
  .error-desc {
    font-size: 16px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>