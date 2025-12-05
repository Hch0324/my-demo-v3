import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { config } from '@/config'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/Error/404.vue'),
    hidden: true
  }
]

// 异步路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'Monitor',
          affix: true
        }
      },
      {
        path: '/data-manage',
        name: 'DataManage',
        redirect: '/data-manage/table-list',
        meta: {
          title: '数据管理',
          icon: 'Grid'
        },
        children: [
          {
            path: 'table-list',
            name: 'TableList',
            component: () => import('@/views/DataManage/TableList.vue'),
            meta: {
              title: '表格列表',
              icon: 'List'
            }
          },
          {
            path: 'form-page',
            name: 'FormPage',
            component: () => import('@/views/DataManage/FormPage.vue'),
            meta: {
              title: '表单页面',
              icon: 'Edit'
            }
          }
        ]
      },
      {
        path: '/charts',
        name: 'Charts',
        redirect: '/charts/line-chart',
        meta: {
          title: '图表分析',
          icon: 'TrendCharts'
        },
        children: [
          {
            path: 'line-chart',
            name: 'LineChart',
            component: () => import('@/views/Charts/LineChart.vue'),
            meta: {
              title: '折线图',
              icon: 'TrendCharts'
            }
          },
          {
            path: 'bar-chart',
            name: 'BarChart',
            component: () => import('@/views/Charts/BarChart.vue'),
            meta: {
              title: '柱状图',
              icon: 'Histogram'
            }
          },
          {
            path: 'pie-chart',
            name: 'PieChart',
            component: () => import('@/views/Charts/PieChart.vue'),
            meta: {
              title: '饼图',
              icon: 'PieChart'
            }
          },
          {
            path: 'radar-chart',
            name: 'RadarChart',
            component: () => import('@/views/Charts/RadarChart.vue'),
            meta: {
              title: '雷达图',
              icon: 'Star'
            }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/user-manage',
        meta: {
          title: '系统管理',
          icon: 'Setting'
        },
        children: [
          {
            path: 'user-manage',
            name: 'UserManage',
            component: () => import('@/views/System/UserManage.vue'),
            meta: {
              title: '用户管理',
              icon: 'User'
            }
          },
          {
            path: 'role-manage',
            name: 'RoleManage',
            component: () => import('@/views/System/RoleManage.vue'),
            meta: {
              title: '角色管理',
              icon: 'Avatar'
            }
          }
        ]
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人信息',
          icon: 'UserFilled',
          affix: false
        }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/System/Settings.vue'),
        meta: {
          title: '个人设置',
          icon: 'Setting',
          affix: false
        }
      },
      {
        path: '/notice',
        name: 'Notice',
        redirect: '/notice/list',
        meta: {
          title: '公告管理',
          icon: 'Document'
        },
        children: [
          {
            path: 'list',
            name: 'NoticeList',
            component: () => import('@/views/Notice/NoticeList.vue'),
            meta: {
              title: '公告列表',
              icon: 'List'
            }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
  const userStore = useUserStore()
  const token = userStore.token
  
  // 在白名单中，直接放行
  if (config.router.whiteList.includes(to.path)) {
    next()
    return
  }
  
  // 有 token
  if (token) {
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/dashboard' })
    } else {
      // 检查是否有用户信息
      if (!userStore.userInfo) {
        try {
          // 获取用户信息
          await userStore.getUserInfoAction()
          
          // 动态添加路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, userStore.roles)
          accessedRoutes.forEach(route => {
            if (route.name === 'Layout') {
              router.addRoute(route)
            }
          })
          
          // 确保动态路由已加载
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，重置 token 并跳转到登录页
          userStore.resetToken()
          ElMessage.error('获取用户信息失败')
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 检查动态路由是否已经添加
        const hasDynamicRoutes = router.getRoutes().some(route => route.name === 'Dashboard')
        if (!hasDynamicRoutes) {
          // 动态添加路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, userStore.roles)
          accessedRoutes.forEach(route => {
            if (route.name === 'Layout') {
              router.addRoute(route)
            }
          })
          
          // 如果当前路径是 dashboard，重新导航
          if (to.path === '/dashboard') {
            next({ ...to, replace: true })
          } else {
            next()
          }
        } else {
          next()
        }
      }
    }
  } else {
    // 没有 token，跳转到登录页
    next(`/login?redirect=${to.path}`)
  }
})

router.afterEach(() => {
  NProgress.done()
})

// 过滤异步路由
function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  
  return res
}

// 检查权限
function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta?.roles) {
    return roles.some(role => route.meta!.roles!.includes(role))
  }
  return true
}

export default router