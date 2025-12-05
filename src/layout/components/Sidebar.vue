<template>
  <div class="sidebar" :class="{ collapse: isCollapse }">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="Logo" v-if="!isCollapse" />
        <span class="logo-text" v-if="!isCollapse">后台管理</span>
        <img src="@/assets/logo-mini.svg" alt="Logo" v-else />
      </div>
      <div class="collapse-btn" @click="$emit('toggle-collapse')">
        <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
      </div>
    </div>
    
    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      background-color="var(--sidebar-bg)"
      text-color="var(--sidebar-text)"
      active-text-color="#ffffff"
      router
      class="sidebar-menu"
    >
      <template v-for="item in menuList" :key="item.id">
        <!-- 有子菜单 -->
        <el-sub-menu
          v-if="item.children && item.children.length > 0"
          :index="item.path"
        >
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.meta?.title || item.name }}</span>
          </template>
          
          <el-menu-item
            v-for="child in item.children"
            :key="child.id"
            :index="child.path"
          >
            <el-icon v-if="child.icon">
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.meta?.title || child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 无子菜单 -->
        <el-menu-item
          v-else
          :index="item.path"
        >
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.meta?.title || item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/config/menu'

interface Props {
  isCollapse: boolean
  menuList: MenuItem[]
}

defineProps<Props>()
defineEmits<{
  'toggle-collapse': []
}>()

const route = useRoute()

const activeMenu = computed(() => {
  const { path } = route
  return path
})
</script>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--sidebar-bg);
  transition: width 0.3s ease;
  z-index: 1000;
  
  &.collapse {
    width: var(--sidebar-collapsed-width);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--header-height);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  
  img {
    width: 32px;
    height: 32px;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
  }
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--sidebar-text);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.sidebar-menu {
  border: none;
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  
  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    border-radius: 6px;
    margin: 2px 8px;
    
    &:hover {
      background-color: var(--sidebar-active-bg) !important;
    }
    
    &.is-active {
      background-color: var(--primary-color) !important;
      color: #ffffff !important;
    }
  }
  
  :deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
    border-radius: 6px;
    margin: 2px 8px;
    
    &:hover {
      background-color: var(--sidebar-active-bg) !important;
    }
  }
  
  :deep(.el-sub-menu .el-menu-item) {
    padding-left: 50px !important;
    
    &.is-active {
      background-color: var(--primary-color) !important;
      color: #ffffff !important;
    }
  }
}

// 滚动条样式
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background-color: transparent;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    
    &.collapse {
      transform: translateX(-100%);
    }
  }
}
</style>