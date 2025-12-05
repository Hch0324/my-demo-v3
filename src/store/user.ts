import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'
import { login, getUserInfo as getUserInfoApi } from '@/api/user'
import type { UserInfo, LoginForm } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(getToken() || '')
  const userInfo = ref<UserInfo | null>(getUserInfo())
  const roles = ref<string[]>([])
  
  // 计算属性
  const isLogin = computed(() => !!token.value)
  
  // 登录
  const loginAction = async (loginForm: LoginForm) => {
    try {
      const response = await login(loginForm)
      token.value = response.token
      setToken(response.token)
      
      // 获取用户信息
      await getUserInfoAction()
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const response = await getUserInfoApi()
      userInfo.value = response
      roles.value = response.roles || []
      setUserInfo(response)
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    roles.value = []
    removeToken()
    removeUserInfo()
  }
  
  // 重置 token
  const resetToken = () => {
    token.value = ''
    removeToken()
  }
  
  return {
    token,
    userInfo,
    roles,
    isLogin,
    loginAction,
    getUserInfoAction,
    logout,
    resetToken
  }
})