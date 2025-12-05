<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="item in breadcrumbs"
        :key="item.path"
        :to="item.path"
      >
        <el-icon v-if="item.icon" class="breadcrumb-icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface BreadcrumbItem {
  title: string
  path: string
  icon?: string
}

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<BreadcrumbItem[]>([])

// 生成面包屑
const generateBreadcrumbs = () => {
  const matched = route.matched.filter(item => item.meta?.title)
  const temp: BreadcrumbItem[] = []
  
  matched.forEach(item => {
    if (item.meta?.title) {
      temp.push({
        title: item.meta.title as string,
        path: item.path,
        icon: item.meta.icon as string
      })
    }
  })
  
  // 添加首页
  if (temp.length === 0 || temp[0].path !== '/') {
    temp.unshift({
      title: '首页',
      path: '/',
      icon: 'HomeFilled'
    })
  }
  
  breadcrumbs.value = temp
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    generateBreadcrumbs()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.breadcrumb {
  padding: 0;
  
  :deep(.el-breadcrumb__inner) {
    color: var(--text-color-regular);
    
    &:hover {
      color: var(--primary-color);
    }
  }
  
  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: var(--text-color-primary);
  }
}

.breadcrumb-icon {
  margin-right: 4px;
  vertical-align: middle;
}
</style>