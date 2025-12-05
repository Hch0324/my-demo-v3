import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const isDark = ref(false)
  const primaryColor = ref('#409eff')
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const savedColor = localStorage.getItem('primary-color')
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 检测系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    
    if (savedColor) {
      primaryColor.value = savedColor
    }
    
    applyTheme()
  }
  
  // 应用主题
  const applyTheme = () => {
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
      
      // 设置 Element Plus 深色主题变量
      html.style.setProperty('--el-bg-color-page', '#141414')
      html.style.setProperty('--el-bg-color', '#1e1e1e')
      html.style.setProperty('--el-bg-color-overlay', '#1e1e1e')
      html.style.setProperty('--el-text-color-primary', '#e8e8e8')
      html.style.setProperty('--el-text-color-regular', '#c0c4cc')
      html.style.setProperty('--el-text-color-secondary', '#909399')
      html.style.setProperty('--el-text-color-placeholder', '#606266')
      html.style.setProperty('--el-border-color', '#434343')
      html.style.setProperty('--el-border-color-light', '#303030')
      html.style.setProperty('--el-border-color-lighter', '#262626')
      html.style.setProperty('--el-border-color-extra-light', '#1a1a1a')
      html.style.setProperty('--el-fill-color', '#1e1e1e')
      html.style.setProperty('--el-fill-color-light', '#262626')
      html.style.setProperty('--el-fill-color-lighter', '#303030')
      html.style.setProperty('--el-fill-color-extra-light', '#3a3a3a')
      html.style.setProperty('--el-box-shadow', '0 2px 12px 0 rgba(0, 0, 0, 0.5)')
      html.style.setProperty('--el-box-shadow-light', '0 2px 8px 0 rgba(0, 0, 0, 0.3)')
      html.style.setProperty('--el-box-shadow-lighter', '0 2px 4px 0 rgba(0, 0, 0, 0.2)')
      html.style.setProperty('--el-box-shadow-dark', '0 4px 20px 0 rgba(0, 0, 0, 0.7)')
      
      // 设置系统自定义变量
      html.style.setProperty('--sidebar-bg', '#141414')
      html.style.setProperty('--sidebar-text', '#e8e8e8')
      html.style.setProperty('--sidebar-active-bg', '#262626')
      html.style.setProperty('--header-bg', '#1e1e1e')
      html.style.setProperty('--main-bg', '#141414')
      html.style.setProperty('--text-color-primary', '#e8e8e8')
      html.style.setProperty('--text-color-regular', '#c0c4cc')
      html.style.setProperty('--text-color-secondary', '#909399')
      
      // 设置所有表格行悬停样式（使用CSS变量，不再需要事件监听器）
      html.style.setProperty('--el-table-tr-hover-bg-color', '#262626')
    } else {
      html.classList.remove('dark')
      html.removeAttribute('data-theme')
      
      // 重置所有Element Plus主题变量
      html.style.removeProperty('--el-bg-color-page')
      html.style.removeProperty('--el-bg-color')
      html.style.removeProperty('--el-bg-color-overlay')
      html.style.removeProperty('--el-text-color-primary')
      html.style.removeProperty('--el-text-color-regular')
      html.style.removeProperty('--el-text-color-secondary')
      html.style.removeProperty('--el-text-color-placeholder')
      html.style.removeProperty('--el-border-color')
      html.style.removeProperty('--el-border-color-light')
      html.style.removeProperty('--el-border-color-lighter')
      html.style.removeProperty('--el-border-color-extra-light')
      html.style.removeProperty('--el-fill-color')
      html.style.removeProperty('--el-fill-color-light')
      html.style.removeProperty('--el-fill-color-lighter')
      html.style.removeProperty('--el-fill-color-extra-light')
      html.style.removeProperty('--el-box-shadow')
      html.style.removeProperty('--el-box-shadow-light')
      html.style.removeProperty('--el-box-shadow-lighter')
      html.style.removeProperty('--el-box-shadow-dark')
      html.style.removeProperty('--el-table-tr-hover-bg-color')
      
      // 重置系统自定义变量
      html.style.removeProperty('--sidebar-bg')
      html.style.removeProperty('--sidebar-text')
      html.style.removeProperty('--sidebar-active-bg')
      html.style.removeProperty('--header-bg')
      html.style.removeProperty('--main-bg')
      html.style.removeProperty('--text-color-primary')
      html.style.removeProperty('--text-color-regular')
      html.style.removeProperty('--text-color-secondary')
    }
    
    // 设置主色调
    html.style.setProperty('--primary-color', primaryColor.value)
    html.style.setProperty('--el-color-primary', primaryColor.value)
  }
  
  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }
  
  // 设置主色调
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    localStorage.setItem('primary-color', color)
    applyTheme()
  }
  
  return {
    isDark,
    primaryColor,
    initTheme,
    toggleTheme,
    setPrimaryColor
  }
})