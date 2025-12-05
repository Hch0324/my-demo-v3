import request from '@/utils/request'
import type { LoginForm, LoginResponse, UserInfo } from '@/types/user'

// 登录
export const login = (data: LoginForm): Promise<LoginResponse> => {
  return request.post('/user/login', data)
}

// 获取用户信息
export const getUserInfo = (): Promise<UserInfo> => {
  return request.get('/user/info')
}

// 退出登录
export const logout = (): Promise<void> => {
  return request.post('/user/logout')
}