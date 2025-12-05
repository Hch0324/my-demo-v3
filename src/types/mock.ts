// 统计数据类型
export interface StatisticsData {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  growthRate: number
}

// 图表数据类型
export interface ChartData {
  xAxis: string[]
  series: number[]
  title: string
}

// 表格数据类型
export interface TableItem {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  createTime: string
  avatar: string
  address: string
}

// 表格列表响应类型
export interface TableListResponse {
  list: TableItem[]
  total: number
  page: number
  pageSize: number
}

// 图表类型枚举
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area'
}