import type { StatisticsData, ChartData, TableItem, TableListResponse } from '@/types/mock'

// 生成随机字符串
const randomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
} 

// 生成随机中文姓名
const chineseNames = ['张伟', '李娜', '王强', '刘洋', '陈静', '杨帆', '赵敏', '黄蓉', '周杰', '吴磊', '郑洁', '孙悦',]
const randomChineseName = (): string => {
  return chineseNames[Math.floor(Math.random() * chineseNames.length)]
}

// 生成随机邮箱
const randomEmail = (name: string): string => {
  const domains = ['qq.com', '163.com', 'gmail.com', 'outlook.com', '126.com']
  const domain = domains[Math.floor(Math.random() * domains.length)]
  return `${name.toLowerCase().replace(/\s+/g, '')}@${domain}`
}

// 生成随机手机号
const randomPhone = (): string => {
  const prefix = ['138', '139', '150', '151', '152', '157', '158', '159', '182', '183', '187', '188', '130', '131', '132', '155', '156', '185', '186']
  const pre = prefix[Math.floor(Math.random() * prefix.length)]
  const suffix = Math.random().toString().slice(2, 10)
  return pre + suffix
}

// 生成随机地址
const randomAddress = (): string => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安', '重庆']
  const city = cities[Math.floor(Math.random() * cities.length)]
  return `${city}市${Math.floor(Math.random() * 10) + 1}区${Math.floor(Math.random() * 100) + 1}号`
}

// 生成随机日期
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

// 生成统计数据
export const generateStatisticsData = (): StatisticsData => {
  return {
    totalUsers: Math.floor(Math.random() * 10000) + 5000,
    totalOrders: Math.floor(Math.random() * 5000) + 2000,
    totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
    growthRate: Math.floor(Math.random() * 50) + 10
  }
}

// 生成图表数据
export const generateChartData = (type: string): ChartData => {
  const titles = {
    line: '用户增长趋势',
    bar: '销售额统计',
    pie: '用户分布',
    area: '访问量趋势'
  }
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const dataPoints = Math.floor(Math.random() * 8) + 5 // 5-12个月份
  
  return {
    xAxis: months.slice(0, dataPoints),
    series: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 1000) + 100),
    title: titles[type as keyof typeof titles] || '数据统计'
  }
}

// 生成表格数据
export const generateTableData = (page: number = 1, pageSize: number = 10): TableListResponse => {
  const total = 100 // 总数据量
  const totalPages = Math.ceil(total / pageSize)
  const currentPage = Math.min(page, totalPages)
  
  const list: TableItem[] = Array.from({ length: pageSize }, (_, index) => {
    const id = (currentPage - 1) * pageSize + index + 1
    const name = randomChineseName()
    const status = ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending'
    
    return {
      id,
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      status,
      createTime: randomDate(new Date('2023-01-01'), new Date()),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      address: randomAddress()
    }
  })
  
  return {
    list,
    total,
    page: currentPage,
    pageSize
  }
}

// 模拟延迟
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}