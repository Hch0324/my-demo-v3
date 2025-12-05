// 菜单配置
export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  component?: string
  children?: MenuItem[]
  meta?: {
    title: string
    roles?: string[]
    keepAlive?: boolean
  }
}

// 菜单数据
export const menuList: MenuItem[] = [
  {
    id: '1',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'Monitor',
    component: 'Dashboard',
    meta: {
      title: '仪表盘',
      keepAlive: true
    }
  },
  {
    id: '2',
    name: 'DataManage',
    path: '/data-manage',
    icon: 'Grid',
    meta: {
      title: '数据管理'
    },
    children: [
      {
        id: '2-1',
        name: 'TableList',
        path: '/data-manage/table-list',
        component: 'TableList',
        meta: {
          title: '表格列表',
          keepAlive: true
        }
      },
      {
        id: '2-2',
        name: 'FormPage',
        path: '/data-manage/form-page',
        component: 'FormPage',
        meta: {
          title: '表单页面',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Charts',
    path: '/charts',
    icon: 'TrendCharts',
    meta: {
      title: '图表分析'
    },
    children: [
      {
        id: '3-1',
        name: 'LineChart',
        path: '/charts/line-chart',
        component: 'LineChart',
        meta: {
          title: '折线图',
          keepAlive: true
        }
      },
      {
        id: '3-2',
        name: 'BarChart',
        path: '/charts/bar-chart',
        component: 'BarChart',
        meta: {
          title: '柱状图',
          keepAlive: true
        }
      },
      {
        id: '3-3',
        name: 'PieChart',
        path: '/charts/pie-chart',
        component: 'PieChart',
        meta: {
          title: '饼图',
          keepAlive: true
        }
      },
      {
        id: '3-4',
        name: 'RadarChart',
        path: '/charts/radar-chart',
        component: 'RadarChart',
        meta: {
          title: '雷达图',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: '4',
    name: 'System',
    path: '/system',
    icon: 'Setting',
    meta: {
      title: '系统管理',
      roles: ['admin']
    },
    children: [
      {
        id: '4-1',
        name: 'UserManage',
        path: '/system/user-manage',
        component: 'UserManage',
        meta: {
          title: '用户管理',
          roles: ['admin']
        }
      },
      {
        id: '4-2',
        name: 'RoleManage',
        path: '/system/role-manage',
        component: 'RoleManage',
        meta: {
          title: '角色管理',
          roles: ['admin']
        }
      }
    ]
  },
  {
    id: '5',
    name: 'Profile',
    path: '/profile',
    icon: 'UserFilled',
    component: 'Profile',
    meta: {
      title: '个人信息',
      keepAlive: true
    }
  },
  {
    id: '6',
    name: 'Settings',
    path: '/settings',
    icon: 'Setting',
    component: 'Settings',
    meta: {
      title: '个人设置',
      keepAlive: true
    }
  }
]