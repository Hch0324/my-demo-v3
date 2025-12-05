<template>
  <router-view />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/theme'

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-color-primary);
  background-color: var(--bg-color-page);
  transition: background-color 0.3s ease;
}

#app {
  height: 100%;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深色主题滚动条 */
html.dark ::-webkit-scrollbar-thumb {
  background: #4c4d4f;
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: #5a5b5d;
}

/* 链接样式 */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--primary-color-dark);
}

/* 按钮样式重置 */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  padding: 0;
}

/* 输入框样式重置 */
input, textarea, select {
  font-family: inherit;
  outline: none;
}

/* 列表样式重置 */
ul, ol {
  list-style: none;
}

/* 表格样式重置 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* 图片样式重置 */
img {
  max-width: 100%;
  height: auto;
}

/* 动画类 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

/* 响应式工具类 */
@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }
  
  .mobile-show {
    display: block !important;
  }
}

@media (min-width: 769px) {
  .desktop-hidden {
    display: none !important;
  }
  
  .desktop-show {
    display: block !important;
  }
}
</style>