<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="card-row">
      <el-col :xs="12" :sm="6" :lg="6" v-for="item in statistics" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color + '20', color: item.color }">
              <el-icon size="24">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
          <div class="stat-footer">
            <span class="stat-trend" :class="{ up: item.trend > 0, down: item.trend < 0 }">
              <el-icon size="12">
                <Top v-if="item.trend > 0" />
                <Bottom v-else />
              </el-icon>
              {{ Math.abs(item.trend) }}%
            </span>
            <span class="stat-period">较上月</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>访问量趋势</span>
              <el-radio-group v-model="lineChartType" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户来源</span>
              <el-radio-group v-model="pieChartType" size="small">
                <el-radio-button label="source">来源</el-radio-button>
                <el-radio-button label="device">设备</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售统计</span>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                style="width: 240px"
              />
            </div>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="primary" text size="small">查看全部</el-button>
            </div>
          </template>
          <div class="todo-list">
            <!-- 添加新待办事项 -->
            <div class="todo-add">
              <el-input
                v-model="newTodoText"
                placeholder="添加新的待办事项"
                @keyup.enter="handleAddTodo"
                clearable
                class="todo-input"
              >
                <template #append>
                  <el-select v-model="newTodoPriority" placeholder="优先级">
                    <el-option label="高" value="high" />
                    <el-option label="中" value="medium" />
                    <el-option label="低" value="low" />
                  </el-select>
                  <el-button type="primary" @click="handleAddTodo">
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
            <!-- 待办事项列表 -->
            <div v-for="item in todoList" :key="item.id" class="todo-item">
              <div class="todo-content">
                <el-checkbox v-model="item.completed" @change="handleTodoChange(item)" />
                <span class="todo-text" :class="{ completed: item.completed }">{{ item.text }}</span>
              </div>
              <div class="todo-actions">
                <el-tag :type="item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'info'" size="small">
                  {{ item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低' }}
                </el-tag>
                <el-button type="danger" link size="small" @click="handleDeleteTodo(item.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div v-if="todoList.length === 0" class="todo-empty">
              <el-empty description="暂无待办事项" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Delete, Plus, Top, Bottom } from '@element-plus/icons-vue'
import { getStatistics, getChartData } from '@/api/dashboard'
import { useThemeStore } from '@/store/theme'
import type { StatisticsData, ChartData } from '@/types/mock'

// 主题存储
const themeStore = useThemeStore()

// 统计数据
const statistics = reactive([
  {
    title: '总用户数',
    value: '2,456',
    icon: 'User',
    color: '#409eff',
    trend: 12.5
  },
  {
    title: '总访问量',
    value: '12,345',
    icon: 'View',
    color: '#67c23a',
    trend: 8.2
  },
  {
    title: '订单数量',
    value: '856',
    icon: 'ShoppingCart',
    color: '#e6a23c',
    trend: -2.1
  },
  {
    title: '销售额',
    value: '¥45,678',
    icon: 'Money',
    color: '#f56c6c',
    trend: 15.8
  }
])

// 加载统计数据
const loadStatistics = async () => {
  try {
    const data: StatisticsData = await getStatistics()
    statistics[0].value = data.totalUsers.toLocaleString()
    statistics[1].value = Math.floor(data.totalUsers * 2.5).toLocaleString()
    statistics[2].value = data.totalOrders.toLocaleString()
    statistics[3].value = `¥${data.totalRevenue.toLocaleString()}`
    
    // 更新增长率
    statistics[0].trend = data.growthRate
    statistics[1].trend = data.growthRate + Math.random() * 5 - 2.5
    statistics[2].trend = data.growthRate - Math.random() * 3
    statistics[3].trend = data.growthRate + Math.random() * 8 - 4
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载图表数据
const loadChartData = async () => {
  try {
    // 加载折线图数据
    const lineData: ChartData = await getChartData('line')
    if (lineChart) {
      const lineOption = lineChart.getOption()
      if (lineOption && lineOption.xAxis && lineOption.series) {
        lineOption.xAxis[0].data = lineData.xAxis
        lineOption.series[0].data = lineData.series.map(v => Math.floor(v * 0.8))
        lineOption.series[1].data = lineData.series.map(v => Math.floor(v * 0.6))
        lineChart.setOption(lineOption)
      }
    }
    
    // 加载柱状图数据
    const barData: ChartData = await getChartData('bar')
    if (barChart) {
      const barOption = barChart.getOption()
      if (barOption && barOption.xAxis && barOption.series) {
        barOption.xAxis[0].data = barData.xAxis
        barOption.series[0].data = barData.series.map(v => Math.floor(v * 0.7))
        barOption.series[1].data = barData.series.map(v => Math.floor(v * 0.3))
        barChart.setOption(barOption)
      }
    }
    
    // 加载饼图数据
    const pieData: ChartData = await getChartData('pie')
    if (pieChart) {
      const pieOption = pieChart.getOption()
      if (pieOption && pieOption.series) {
        const total = pieData.series.reduce((sum, val) => sum + val, 0)
        pieOption.series[0].data = [
          { value: Math.floor(pieData.series[0] * 0.3), name: '搜索引擎' },
          { value: Math.floor(pieData.series[1] * 0.25), name: '直接访问' },
          { value: Math.floor(pieData.series[2] * 0.2), name: '邮件营销' },
          { value: Math.floor(pieData.series[3] * 0.15), name: '联盟广告' },
          { value: Math.floor(pieData.series[4] * 0.1), name: '视频广告' }
        ]
        pieChart.setOption(pieOption)
      }
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

// 图表引用
const lineChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()

let lineChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

// 图表类型
const lineChartType = ref('day')
const pieChartType = ref('source')
const dateRange = ref('')

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

// 待办事项
const todoList = reactive([
  { id: 1, text: '完成项目文档编写', completed: false, priority: 'high' },
  { id: 2, text: '代码审查', completed: true, priority: 'medium' },
  { id: 3, text: '更新用户手册', completed: false, priority: 'low' },
  { id: 4, text: '数据库优化', completed: false, priority: 'high' },
  { id: 5, text: '测试用例编写', completed: false, priority: 'medium' }
])

// 新待办事项
const newTodoText = ref('')
const newTodoPriority = ref('medium')

// 待办事项ID计数器
let todoIdCounter = todoList.length > 0 ? Math.max(...todoList.map(item => item.id)) + 1 : 1

// 初始化折线图
const initLineChart = () => {
  if (!lineChartRef.value) return
  
  lineChart = echarts.init(lineChartRef.value)
  
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
      data: ['访问量', '用户数'],
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
      }
    ]
  }
  
  lineChart.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  
  pieChart = echarts.init(pieChartRef.value)
  
  const colors = getThemeColors()
  const option = {
    backgroundColor: colors.backgroundColor,
    tooltip: {
      trigger: 'item',
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
        radius: '50%',
        data: [
          { value: 1048, name: '搜索引擎', itemStyle: { color: colors.primaryColor } },
          { value: 735, name: '直接访问', itemStyle: { color: colors.successColor } },
          { value: 580, name: '邮件营销', itemStyle: { color: colors.warningColor } },
          { value: 484, name: '联盟广告', itemStyle: { color: colors.dangerColor } },
          { value: 300, name: '视频广告', itemStyle: { color: '#909399' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  pieChart.setOption(option)
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return
  
  barChart = echarts.init(barChartRef.value)
  
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
      data: ['销售额', '利润'],
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
        data: [2000, 2500, 3000, 3500, 4000, 4500, 5000, 4800, 5200, 5500, 5800, 6000],
        itemStyle: {
          color: colors.primaryColor
        }
      },
      {
        name: '利润',
        type: 'bar',
        data: [800, 1000, 1200, 1400, 1600, 1800, 2000, 1900, 2100, 2200, 2300, 2400],
        itemStyle: {
          color: colors.successColor
        }
      }
    ]
  }
  
  barChart.setOption(option)
}

// 处理待办事项变化
const handleTodoChange = (item: any) => {
  console.log('Todo item changed:', item)
}

// 添加待办事项
const handleAddTodo = () => {
  if (!newTodoText.value.trim()) return
  
  const newTodo = {
    id: todoIdCounter++,
    text: newTodoText.value.trim(),
    completed: false,
    priority: newTodoPriority.value
  }
  
  todoList.push(newTodo)
  newTodoText.value = ''
  newTodoPriority.value = 'medium'
}

// 删除待办事项
const handleDeleteTodo = (id: number) => {
  const index = todoList.findIndex(item => item.id === id)
  if (index !== -1) {
    todoList.splice(index, 1)
  }
}

// 监听图表类型变化
watch(lineChartType, () => {
  // 重新加载图表数据
  if (lineChart) {
    lineChart.clear()
    initLineChart()
  }
})

watch(pieChartType, () => {
  // 重新加载图表数据
  if (pieChart) {
    pieChart.clear()
    initPieChart()
  }
})

// 监听主题变化
watch(() => themeStore.isDark, () => {
  nextTick(() => {
    // 重新初始化所有图表
    if (lineChart) {
      lineChart.clear()
      initLineChart()
    }
    if (pieChart) {
      pieChart.clear()
      initPieChart()
    }
    if (barChart) {
      barChart.clear()
      initBarChart()
    }
  })
})

// 响应式处理
const handleResize = () => {
  lineChart?.resize()
  pieChart?.resize()
  barChart?.resize()
}

onMounted(() => {
  // 加载模拟数据
  loadStatistics()
  loadChartData()
  
  initLineChart()
  initPieChart()
  initBarChart()
  
  window.addEventListener('resize', handleResize)
})

// 清理
const cleanup = () => {
  lineChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
  window.removeEventListener('resize', handleResize)
}

// 组件卸载时清理
onUnmounted(cleanup)
</script>

<style scoped lang="scss">
.dashboard {
  padding: 0;
}

.card-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  text-align: right;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 4px;
}

.stat-title {
  font-size: 14px;
  color: var(--text-color-secondary);
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid var(--border-color-lighter);
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  
  &.up {
    color: var(--success-color);
  }
  
  &.down {
    color: var(--danger-color);
  }
}

.stat-period {
  font-size: 12px;
  color: var(--text-color-secondary);
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

.chart-container {
  width: 100%;
  height: 300px;
}

.todo-list {
  max-height: 300px;
  overflow-y: auto;
}

.todo-add {
  margin-bottom: 16px;
}

.todo-input {
  width: 100%;
  
  :deep(.el-input__inner) {
    border-radius: 8px;
  }
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color-lighter);
  
  &:last-child {
    border-bottom: none;
  }
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.todo-text {
  font-size: 14px;
  color: var(--text-color-primary);
  
  &.completed {
    text-decoration: line-through;
    color: var(--text-color-secondary);
  }
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo-empty {
  padding: 20px 0;
  text-align: center;
}

.todo-actions :deep(.el-button) {
  padding: 0;
  margin: 0;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>