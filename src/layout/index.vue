<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <Sidebar
      :is-collapse="isCollapse"
      :menu-list="menuList"
      @toggle-collapse="toggleCollapse"
    />
    
    <!-- 主内容区 -->
    <div class="main-container" :class="{ 'sidebar-collapse': isCollapse }">
      <!-- 顶部导航 -->
      <Header
        :is-collapse="isCollapse"
        @toggle-collapse="toggleCollapse"
      />
      
      <!-- 内容区域 -->
      <div class="content-wrapper">
        <!-- 面包屑 -->
        <!-- <Breadcrumb /> -->
        
        <!-- 主内容 -->
        <main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import { menuList } from '@/config/menu'

const isCollapse = ref(false)

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  localStorage.setItem('sidebar-collapse', isCollapse.value.toString())
}

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth < 768) {
    isCollapse.value = true
  } else {
    const saved = localStorage.getItem('sidebar-collapse')
    isCollapse.value = saved === 'true'
  }
}

onMounted(() => {
  // 初始化侧边栏状态
  const saved = localStorage.getItem('sidebar-collapse')
  if (saved !== null) {
    isCollapse.value = saved === 'true'
  } else {
    handleResize()
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  
  &.sidebar-collapse {
    margin-left: var(--sidebar-collapsed-width);
  }
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: var(--main-bg);
  overflow-y: auto;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
    
    &.sidebar-collapse {
      margin-left: 0;
    }
  }
}
</style>