// 全局配置
export const config = {
  // 应用配置
  app: {
    title: '后台管理系统',
    version: '1.0.0'
  },
  
  // API 配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000
  },
  
  // 主题配置
  theme: {
    defaultTheme: 'light',
    primaryColor: '#409eff'
  },
  
  // 路由配置
  router: {
    whiteList: ['/login', '/404'], // 白名单路由，不需要登录
    defaultRoute: '/dashboard' // 默认跳转路由
  },
  
  // 分页配置
  pagination: {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100]
  }
}