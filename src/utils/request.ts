import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { mockDelay, generateStatisticsData, generateChartData, generateTableData } from './mock'
import type { LoginResponse, UserInfo } from '@/types/user'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  } 
})

// 模拟数据配置
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || false

// 模拟 API 响应
const mockApiResponse = async (url: string, method: string, data?: any) => {
  await mockDelay(300) // 模拟网络延迟
  
  // 用户相关接口
  if (url.includes('/user/login') && method === 'post') {
    const { username, password } = data
    if (username && password) {
      const mockResponse: LoginResponse = {
        token: 'mock-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: username,
          email: username + '@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username,
          roles: ['admin'],
          permissions: ['read', 'write', 'delete']
        }
      }
      return mockResponse
    }
  }
  
  if (url.includes('/user/info') && method === 'get') {
    const mockUserInfo: UserInfo = {
      id: 1,
      username: '管理员',
      email: 'admin@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      roles: ['admin'],
      permissions: ['read', 'write', 'delete']
    }
    return mockUserInfo
  }
  
  if (url.includes('/user/logout') && method === 'post') {
    return null
  }
  
  // 仪表板相关接口
  if (url.includes('/dashboard/statistics') && method === 'get') {
    return generateStatisticsData()
  }
  
  if (url.includes('/dashboard/chart') && method === 'get') {
    const type = url.split('/').pop() || 'line'
    return generateChartData(type)
  }
  
  // 表格相关接口
  if (url.includes('/table/list') && method === 'get') {
    const params = data || {}
    return generateTableData(params.page || 1, params.pageSize || 10)
  }
  
  if (url.includes('/table/delete') && method === 'delete') {
    return { success: true, message: '删除成功' }
  }
  
  if (url.includes('/table/batch-delete') && method === 'post') {
    return { success: true, message: '批量删除成功' }
  }
  
  if (url.includes('/table/update') && method === 'put') {
    return { success: true, message: '更新成功' }
  }
  
  if (url.includes('/table/add') && method === 'post') {
    return { success: true, message: '添加成功', id: Date.now() }
  }
  
  // 默认响应
  throw new Error('未找到对应的模拟接口: ' + url)
}

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    
    // 如果使用模拟数据，直接返回模拟响应，不发送真实请求
    if (USE_MOCK) {
      const url = config.url || ''
      const method = config.method || 'get'
      const data = config.data
      
      console.log('模拟数据请求:', { url, method, data })
      
      try {
        const mockData = await mockApiResponse(url, method, data)
        console.log('模拟数据响应:', mockData)
        
        // 创建模拟响应对象
        const mockResponse = {
          data: mockData,
          status: 200,
          statusText: 'OK',
          headers: config.headers || {},
          config: config
        }
        
        // 返回一个被拒绝的Promise，这样响应拦截器会处理这个模拟响应
        return Promise.reject({
          isMockResponse: true,
          mockResponse: mockResponse
        })
      } catch (error: any) {
        console.error('模拟数据生成失败:', error)
        ElMessage.error(error.message || '模拟数据生成失败')
        return Promise.reject(error)
      }
    }
    
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    // 真实 API 响应处理
    const { code, message, data } = response.data
    
    if (code === 200) {
      return data
    } else {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message || 'Error'))
    }
  },
  (error) => {
    // 处理模拟响应
    if (error.isMockResponse && error.mockResponse) {
      return Promise.resolve(error.mockResponse.data)
    }
    
    // 模拟模式下不处理网络错误
    if (USE_MOCK) {
      return Promise.reject(error)
    }
    
    const { response } = error
    
    if (response) {
      const { status, data } = response
      
      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          const userStore = useUserStore()
          userStore.logout()
          ElMessage.error('登录已过期，请重新登录')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else {
      ElMessage.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

export default service