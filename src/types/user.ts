// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  roles: string[]
  permissions: string[]
}

// 登录表单接口
export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

// 登录响应接口
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}