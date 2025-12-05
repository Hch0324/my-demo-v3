<template>
  <div class="header">
    <div class="header-left">
      <div class="collapse-btn" @click="$emit('toggle-collapse')">
        <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
      </div>
      
      <div class="breadcrumb-container">
        <Breadcrumb />
      </div>
    </div>
    
    <div class="header-right">
      <!-- 主题切换 -->
      <div class="header-item" @click="toggleTheme">
        <el-icon size="18">
          <Sunny v-if="themeStore.isDark" />
          <Moon v-else />
        </el-icon>
      </div>
      
      <!-- 全屏切换 -->
      <div class="header-item" @click="toggleFullscreen">
        <el-icon size="18">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </div>
      
      <!-- 消息通知 -->
      <div class="header-item">
        <el-badge :value="3" class="badge-item">
          <el-icon size="18"><Bell /></el-icon>
        </el-badge>
      </div>
      
      <!-- 用户下拉 -->
      <el-dropdown @command="handleCommand" class="user-dropdown">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.userInfo?.avatar || defaultAvatar" />
          <span class="username">{{ userStore.userInfo?.username || '用户' }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              个人设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const isFullscreen = ref(false)

interface Props {
  isCollapse: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-collapse': []
}>()

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
  ElMessage.success(`已切换至${themeStore.isDark ? '暗色' : '亮色'}主题`)
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 处理用户下拉菜单命令
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/login')
    ElMessage.success('已退出登录')
  }).catch(() => {
    // 取消退出
  })
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 20px;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
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
  color: var(--text-color-primary);
  
  &:hover {
    background-color: var(--bg-color-light);
  }
}

.breadcrumb-container {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color-primary);
  
  &:hover {
    background-color: var(--bg-color-light);
  }
}

.badge-item {
  :deep(.el-badge__content) {
    top: 8px;
    right: 8px;
  }
}

.user-dropdown {
  cursor: pointer;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--bg-color-light);
    }
  }
  
  .username {
    font-size: 14px;
    color: var(--text-color-primary);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .dropdown-icon {
    font-size: 12px;
    color: var(--text-color-secondary);
    transition: transform 0.3s ease;
  }
  
  &:hover .dropdown-icon {
    transform: rotate(180deg);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 10px;
  }
  
  .breadcrumb-container {
    display: none;
  }
  
  .username {
    display: none;
  }
}
</style>