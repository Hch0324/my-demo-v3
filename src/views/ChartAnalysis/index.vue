<template>
  <div class="chart-analysis">
    <!-- 图表筛选器 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="图表类型">
          <el-select v-model="filterForm.chartType" placeholder="请选择图表类型" style="width: 150px">
            <el-option label="折线图" value="line" />
            <el-option label="柱状图" value="bar" />
            <el-option label="饼图" value="pie" />
            <el-option label="散点图" value="scatter" />
            <el-option label="雷达图" value="radar" />
            <el-option label="仪表盘" value="gauge" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据维度">
          <el-select v-model="filterForm.dimension" placeholder="请选择维度" style="width: 150px">
            <el-option label="时间" value="time" />
            <el-option label="地区" value="region" />
            <el-option label="产品" value="product" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">
            <el-icon><Search /></el-icon>
            应用筛选
          </el-button>
          <el-button @click="handleResetFilter">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表展示区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>趋势分析</span>
              <el-radio-group v-model="trendType" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>占比分析</span>
              <el-radio-group v-model="ratioType" size="small">
                <el-radio-button label="source">来源</el-radio-button>
                <el-radio-button label="device">设备</el-radio-button>
                <el-radio-button label="browser">浏览器</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="ratioChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>对比分析</span>
              <el-radio-group v-model="compareType" size="small">
                <el-radio-button label="product">产品</el-radio-button>
                <el-radio-button label="region">地区</el-radio-button>
                <el-radio-button label="channel">渠道</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="compareChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>性能指标</span>
              <el-button type="primary" text size="small">刷新</el-button>
            </div>
          </template>
          <div ref="gaugeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>分布分析</span>
              <el-radio-group v-model="distributionType" size="small">
                <el-radio-button label="age">年龄</el-radio-button>
                <el-radio-button label="income">收入</el-radio-button>
                <el-radio-button label="education">学历</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="distributionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>关联分析</span>
              <el-radio-group v-model="correlationType" size="small">
                <el-radio-button label="scatter">散点图</el-radio-button>
                <el-radio-button label="heatmap">热力图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="correlationChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 高级图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>综合仪表盘</span>
              <div class="header-actions">
                <el-button type="primary" text size="small" @click="refreshAllCharts">
                  <el-icon><Refresh /></el-icon>
                  刷新全部
                </el-button>
                <el-button type="primary" text size="small" @click="exportCharts">
                  <el-icon><Download /></el-icon>
                  导出图表
                </el-button>
              </div>
            </div>
          </template>
          <div ref="dashboardChartRef" class="chart-container large"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useThemeStore } from '@/store/theme'

// 主题存储
const themeStore = useThemeStore()

// 筛选表单
const filterForm = reactive({
  chartType: 'line',
  dimension: 'time',
  dateRange: ''
})

// 图表类型切换
const trendType = ref('day')
const ratioType = ref('source')
const compareType = ref('product')
const distributionType = ref('age')
const correlationType = ref('scatter')

// 图表引用
const trendChartRef = ref<HTMLElement>()
const ratioChartRef = ref<HTMLElement>()
const compareChartRef = ref<HTMLElement>()
const gaugeChartRef = ref<HTMLElement>()
const distributionChartRef = ref<HTMLElement>()
const correlationChartRef = ref<HTMLElement>()
const dashboardChartRef = ref<HTMLElement>()

let trendChart: echarts.ECharts | null = null
let ratioChart: echarts.ECharts | null = null
let compareChart: echarts.ECharts | null = null
let gaugeChart: echarts.ECharts | null = null
let distributionChart: echarts.ECharts | null = null
let correlationChart: echarts.ECharts | null = null
let dashboardChart: echarts.ECharts | null = null

// 获取主题颜色
const getThemeColors = () => {
  const isDark = themeStore.isDark
  return {
    textColor: isDark ? '#e0e0e0' : '#333333',
    lineColor: isDark ? '#444444' : '#e0e0e0',
    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    tooltipBackground: isDark ? '#2a2a2a' : '#ffffff',
    primaryColor: '#409eff',
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c'
  }
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart = echarts.init(trendChartRef.value)
  
  const colors = getThemeColors()
  const option = {
    backgroundColor: colors.backgroundColor,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: colors.tooltipBackground,
      borderColor: colors.lineColor,
      textStyle: {
        color: colors.textColor
      }
    },
    legend: {
      data: ['访问量', '用户数', '转化率'],
      textStyle: {
        color: colors.textColor
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: {
        lineStyle: {
          color: colors.lineColor
        }
      },
      axisLabel: {
        color: colors.textColor
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: colors.lineColor
          }
        },
        axisLabel: {
          color: colors.textColor
        },
        nameTextStyle: {
          color: colors.textColor
        }
      },
      {
        type: 'value',
        name: '转化率(%)',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: colors.lineColor
          }
        },
        axisLabel: {
          color: colors.textColor
        },
        nameTextStyle: {
          color: colors.textColor
        }
      }
    ],
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: colors.primaryColor
        }
      },
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310],
        itemStyle: {
          color: colors.successColor
        }
      },
      {
        name: '转化率',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [12, 13, 10, 13, 9, 23, 21],
        itemStyle: {
          color: colors.warningColor
        }
      }
    ]
  }
  
  trendChart.setOption(option)
}

// 初始化占比图表
const initRatioChart = () => {
  if (!ratioChartRef.value) return
  
  ratioChart = echarts.init(ratioChartRef.value)
  
  const colors = getThemeColors()
  const option = {
    backgroundColor: colors.backgroundColor,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: colors.tooltipBackground,
      borderColor: colors.lineColor,
      textStyle: {
        color: colors.textColor
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: colors.textColor
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: colors.backgroundColor,
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center',
          color: colors.textColor
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold',
            color: colors.textColor
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '搜索引擎', itemStyle: { color: colors.primaryColor } },
          { value: 735, name: '直接访问', itemStyle: { color: colors.successColor } },
          { value: 580, name: '邮件营销', itemStyle: { color: colors.warningColor } },
          { value: 484, name: '联盟广告', itemStyle: { color: colors.dangerColor } },
          { value: 300, name: '视频广告', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  
  ratioChart.setOption(option)
}

// 初始化对比图表
const initCompareChart = () => {
  if (!compareChartRef.value) return
  
  compareChart = echarts.init(compareChartRef.value)
  
  const colors = getThemeColors()
  const option = {
    backgroundColor: colors.backgroundColor,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: colors.tooltipBackground,
      borderColor: colors.lineColor,
      textStyle: {
        color: colors.textColor
      }
    },
    legend: {
      data: ['销售额', '利润', '成本'],
      textStyle: {
        color: colors.textColor
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['产品A', '产品B', '产品C', '产品D', '产品E'],
      axisLine: {
        lineStyle: {
          color: colors.lineColor
        }
      },
      axisLabel: {
        color: colors.textColor
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: colors.lineColor
        }
      },
      axisLabel: {
        color: colors.textColor
      },
      nameTextStyle: {
        color: colors.textColor
      }
    },
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: [320, 332, 301, 334, 390],
        itemStyle: {
          color: colors.primaryColor
        }
      },
      {
        name: '利润',
        type: 'bar',
        data: [120, 132, 101, 134, 90],
        itemStyle: {
          color: colors.successColor
        }
      },
      {
        name: '成本',
        type: 'bar',
        data: [220, 182, 191, 234, 290],
        itemStyle: {
          color: colors.dangerColor
        }
      }
    ]
  }
  
  compareChart.setOption(option)
}

// 初始化仪表盘图表
const initGaugeChart = () => {
  if (!gaugeChartRef.value) return
  
  gaugeChart = echarts.init(gaugeChartRef.value)
  
  const option = {
    series: [
      {
        name: '完成率',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%'
        },
        data: [
          {
            value: 70,
            name: '月度目标'
          }
        ]
      }
    ]
  }
  
  gaugeChart.setOption(option)
}

// 初始化分布图表
const initDistributionChart = () => {
  if (!distributionChartRef.value) return
  
  distributionChart = echarts.init(distributionChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['18-25', '26-35', '36-45', '46-55', '55+']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '用户数量',
        type: 'bar',
        data: [120, 200, 150, 80, 70],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  }
  
  distributionChart.setOption(option)
}

// 初始化关联图表
const initCorrelationChart = () => {
  if (!correlationChartRef.value) return
  
  correlationChart = echarts.init(correlationChartRef.value)
  
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push([
      Math.random() * 100,
      Math.random() * 100
    ])
  }
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数据点',
        type: 'scatter',
        data: data,
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }
  
  correlationChart.setOption(option)
}

// 初始化综合仪表盘
const initDashboardChart = () => {
  if (!dashboardChartRef.value) return
  
  dashboardChart = echarts.init(dashboardChartRef.value)
  
  const colors = getThemeColors()
  const option = {
    backgroundColor: colors.backgroundColor,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: colors.tooltipBackground,
      borderColor: colors.lineColor,
      textStyle: {
        color: colors.textColor
      }
    },
    legend: {
      data: ['销售额', '用户数', '订单数', '转化率'],
      textStyle: {
        color: colors.textColor
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: {
        lineStyle: {
          color: colors.lineColor
        }
      },
      axisLabel: {
        color: colors.textColor
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: colors.lineColor
          }
        },
        axisLabel: {
          color: colors.textColor
        },
        nameTextStyle: {
          color: colors.textColor
        }
      },
      {
        type: 'value',
        name: '转化率(%)',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: colors.lineColor
          }
        },
        axisLabel: {
          color: colors.textColor
        },
        nameTextStyle: {
          color: colors.textColor
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: [2000, 2500, 3000, 3500, 4000, 4500, 5000, 4800, 5200, 5500, 5800, 6000],
        itemStyle: {
          color: colors.primaryColor
        }
      },
      {
        name: '用户数',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        itemStyle: {
          color: colors.successColor
        }
      },
      {
        name: '订单数',
        type: 'line',
        data: [80, 95, 88, 102, 115, 125, 140, 135, 145, 160, 175, 185],
        itemStyle: {
          color: colors.warningColor
        }
      },
      {
        name: '转化率',
        type: 'line',
        yAxisIndex: 1,
        data: [12, 13, 10, 13, 9, 23, 21, 18, 19, 23, 29, 33],
        itemStyle: {
          color: colors.dangerColor
        }
      }
    ]
  }
  
  dashboardChart.setOption(option)
}

// 应用筛选
const handleFilter = () => {
  // 重新加载图表数据
  refreshAllCharts()
}

// 重置筛选
const handleResetFilter = () => {
  filterForm.chartType = 'line'
  filterForm.dimension = 'time'
  filterForm.dateRange = ''
  handleFilter()
}

// 刷新所有图表
const refreshAllCharts = () => {
  trendChart?.clear()
  ratioChart?.clear()
  compareChart?.clear()
  gaugeChart?.clear()
  distributionChart?.clear()
  correlationChart?.clear()
  dashboardChart?.clear()
  
  initTrendChart()
  initRatioChart()
  initCompareChart()
  initGaugeChart()
  initDistributionChart()
  initCorrelationChart()
  initDashboardChart()
}

// 导出图表
const exportCharts = () => {
  // 导出功能实现
  console.log('导出图表功能')
}

// 响应式处理
const handleResize = () => {
  trendChart?.resize()
  ratioChart?.resize()
  compareChart?.resize()
  gaugeChart?.resize()
  distributionChart?.resize()
  correlationChart?.resize()
  dashboardChart?.resize()
}

// 监听图表类型变化
watch([trendType, ratioType, compareType, distributionType, correlationType], () => {
  refreshAllCharts()
})

// 监听主题变化
watch(() => themeStore.isDark, () => {
  nextTick(() => {
    refreshAllCharts()
  })
})

onMounted(() => {
  initTrendChart()
  initRatioChart()
  initCompareChart()
  initGaugeChart()
  initDistributionChart()
  initCorrelationChart()
  initDashboardChart()
  
  window.addEventListener('resize', handleResize)
})

// 清理
const cleanup = () => {
  trendChart?.dispose()
  ratioChart?.dispose()
  compareChart?.dispose()
  gaugeChart?.dispose()
  distributionChart?.dispose()
  correlationChart?.dispose()
  dashboardChart?.dispose()
  window.removeEventListener('resize', handleResize)
}

// 组件卸载时清理
onUnmounted(cleanup)
</script>

<style scoped lang="scss">
.chart-analysis {
  padding: 0;
}

.filter-card {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
  
  :deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color-lighter);
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color-primary);
  }
}

.header-actions {
  display: flex;
  gap: 10px;
}

.chart-container {
  width: 100%;
  height: 300px;
  
  &.large {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
    
    &.large {
      height: 300px;
    }
  }
}
</style>