import request from '@/utils/request'
import type { StatisticsData, ChartData } from '@/types/mock'

// 获取统计数据
export const getStatistics = (): Promise<StatisticsData> => {
  return request.get('/dashboard/statistics')
}

// 获取图表数据
export const getChartData = (type: string): Promise<ChartData> => {
  return request.get(`/dashboard/chart/${type}`)
}