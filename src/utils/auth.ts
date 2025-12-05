import Cookies from 'js-cookie'

const TOKEN_KEY = 'admin-token'
const USER_INFO_KEY = 'admin-user-info'

// 获取 token
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY)
}

// 设置 token
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 })
}

// 移除 token
export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY)
}

// 获取用户信息
export const getUserInfo = (): any => {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

// 设置用户信息
export const setUserInfo = (userInfo: any): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

// 移除用户信息
export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY)
}