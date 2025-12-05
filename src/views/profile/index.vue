<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      
      <div class="profile-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="profile-avatar">
              <el-avatar :size="120" :src="userInfo.avatar || defaultAvatar" />
              <div class="avatar-actions">
                <el-button type="primary" size="small" @click="handleEditAvatar">
                  修改头像
                </el-button>
              </div>
            </div>
          </el-col>
          
          <el-col :span="16">
            <el-form ref="userFormRef" :model="userInfo" :rules="userFormRules" label-width="80px" size="large">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.userName" :disabled="!isEditing" />
              </el-form-item>
              
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" :disabled="!isEditing" />
              </el-form-item>
              
              <el-form-item label="手机号">
                <el-input v-model="userInfo.phone" :disabled="!isEditing" />
              </el-form-item>
              
              <el-form-item label="部门">
                <el-input v-model="userInfo.department" disabled />
              </el-form-item>
              
              <el-form-item label="角色">
                <el-tag v-for="role in userInfo.roles" :key="role" type="info" class="role-tag">
                  {{ role }}
                </el-tag>
              </el-form-item>
              
              <el-form-item label="注册时间">
                <el-input :value="formatDate(userInfo.createTime)" disabled />
              </el-form-item>
            </el-form>
            
            <div class="form-actions">
              <el-button v-if="!isEditing" type="primary" @click="handleEdit">
                编辑信息
              </el-button>
              <el-button v-if="isEditing" type="primary" @click="handleSave">
                保存
              </el-button>
              <el-button v-if="isEditing" @click="handleCancel">
                取消
              </el-button>
              <el-button type="warning" @click="handleChangePassword">
                修改密码
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    
    <!-- 修改头像对话框 -->
    <el-dialog
      v-model="avatarDialogVisible"
      title="修改头像"
      width="400px"
    >
      <div class="avatar-upload">
        <el-upload
          class="avatar-uploader"
          action="/api/upload/avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="tempAvatar" :src="tempAvatar" class="avatar-preview" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="avatarDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAvatarChange">确定</el-button>
      </template>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
    >
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules" label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import type { UploadProps } from 'element-plus'
import { updateUserInfo, updateAvatar, changePassword } from '@/api/user'

const userStore = useUserStore()

// 用户信息
const userInfo = reactive({
  userName: '',
  email: '',
  phone: '',
  department: '',
  roles: [] as string[],
  avatar: '',
  createTime: ''
})

// 编辑状态
const isEditing = ref(false)

// 对话框状态
const avatarDialogVisible = ref(false)
const passwordDialogVisible = ref(false)

// 临时头像
const tempAvatar = ref('')

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单引用
const userFormRef = ref<InstanceType<typeof ElForm> | null>(null)
const passwordFormRef = ref<InstanceType<typeof ElForm> | null>(null)

// 表单验证规则
const userFormRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordFormRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '新密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ]
}

// 默认头像
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiNGNUY3RkEiLz4KPHN2ZyB4PSIxNiIgeT0iMTQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJDMTMuMTA1NCAxMiAxNCAxMS4xMDU0IDE0IDEwQzE0IDguODk0NTUgMTMuMTA1NCA4IDEyIDhDMTAuODk0NSA4IDEwIDguODk0NTUgMTAgMTBDMTAgMTEuMTA1NCAxMC44OTQ1IDEyIDEyIDEyWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIgMkM2LjQ3NzE1IDIgMiA2LjQ3NzE1IDIgMTJDMiAxNy41MjI4IDYuNDc3MTUgMjIgMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJaTTEyIDE5QzkuNzkwODYgMTkgNy45MDI2OCAxNy4xMDQ2IDcuMTkyNTMgMTVIMTYuODA3N0MxNi4wOTczIDE3LjEwNDYgMTQuMjA5MSAxOSAxMiAxOVpNMTIgM0MxNi40MTg3IDMgMjAgNi41ODEyMyAyMCAxMUMyMCAxNC40MDA5IDE3LjU4MTcgMTcuMjQ1MSAxNC4zMTI1IDE4LjI4MTJDMTUuNTAxOSAxNy4yNzYgMTYuMjUgMTUuNzA2NyAxNi4yNSAxNEMxNi4yNSAxMS4xMDA1IDEzLjg5OTUgOC41IDEwLjk1IDguNUM5LjY5MTg2IDguNSA4LjU1NzQ3IDguOTM5MTMgNy42OTc2OSA5LjY5NzY5QzYuMDY2MjMgOC43MDc5MSA0Ljc5OTk5IDcuMDk5MTIgNCA1SDhDOC41NTIyMyA1IDkgNC41NTIyMyA5IDRWMy4wMDEwMkM5LjU5MzUxIDMuMDAzMzIgMTAuMTc4MyAzIDEwLjc1IDNDMTEuMTY4MyAzIDExLjU3MjEgMy4wMTI3IDExLjk2NTIgMy4wMzY5QzEyLjYzMjkgMy4wNzIxIDEzLjI3MTggMy4xNTQ2MiAxMy44NzU0IDMuMjc5NEMxNC4xNzQ5IDMuMzQxNTIgMTQuNDY0MSAzLjQxNTg5IDE0Ljc0MjkgMy41MDE5MkMxNC44MjgxIDMuNTI5MDEgMTQuOTEyNyAzLjU1NzE1IDE1IDMuNTg2MjdWM0gxM1Y0QzEzIDQuNTUyMjMgMTIuNTUyMyA1IDEyIDVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K'

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 获取用户信息
const getUserInfo = () => {
  const user = userStore.userInfo
  if (user) {
    userInfo.userName = user.userName || ''
    userInfo.email = user.email || ''
    userInfo.phone = user.phone || ''
    userInfo.department = user.department || '技术部'
    userInfo.roles = user.roles || []
    userInfo.avatar = user.avatar || ''
    userInfo.createTime = user.createTime || ''
  }
}

// 编辑信息
const handleEdit = () => {
  isEditing.value = true
}

// 保存信息
const handleSave = async () => {
  try {
    await userFormRef.value?.validate()
    await updateUserInfo(userInfo)
    ElMessage.success('个人信息已更新')
    isEditing.value = false
    // 更新用户存储
    await userStore.getUserInfoAction()
  } catch (error: any) {
    if (error === false) {
      // 表单验证失败
      return
    }
    ElMessage.error('更新个人信息失败')
  }
}

// 取消编辑
const handleCancel = () => {
  isEditing.value = false
  // 重新获取用户信息，重置表单
  getUserInfo()
}

// 修改头像
const handleEditAvatar = () => {
  avatarDialogVisible.value = true
}

// 头像上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  tempAvatar.value = response.url
}

// 头像上传前检查
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 确认头像修改
const confirmAvatarChange = async () => {
  if (tempAvatar.value) {
    try {
      await updateAvatar({ avatar: tempAvatar.value })
      userInfo.avatar = tempAvatar.value
      ElMessage.success('头像修改成功')
      // 更新用户存储
      await userStore.getUserInfoAction()
    } catch (error) {
      ElMessage.error('头像修改失败')
    }
  }
  avatarDialogVisible.value = false
}

// 修改密码
const handleChangePassword = () => {
  passwordDialogVisible.value = true
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  try {
    await passwordFormRef.value?.validate()
    
    await changePassword(passwordForm)
    ElMessage.success('密码修改成功')
    passwordDialogVisible.value = false
    
    // 重置表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    if (error === false) {
      // 表单验证失败
      return
    }
    ElMessage.error('密码修改失败')
  }
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20px;
  
  .profile-card {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .card-header {
    font-size: 18px;
    font-weight: bold;
  }
  
  .profile-content {
    padding: 20px 0;
  }
  
  .profile-avatar {
    text-align: center;
    
    .el-avatar {
      margin-bottom: 15px;
    }
    
    .avatar-actions {
      margin-top: 10px;
    }
  }
  
  .role-tag {
    margin-right: 8px;
  }
  
  .form-actions {
    margin-top: 20px;
    text-align: center;
    
    .el-button {
      margin: 0 10px;
    }
  }
  
  .avatar-upload {
    text-align: center;
    
    .avatar-uploader {
      display: inline-block;
      
      .avatar-preview {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 120px;
        border: 1px dashed #d9d9d9;
        border-radius: 50%;
        cursor: pointer;
        
        &:hover {
          border-color: #409eff;
        }
      }
    }
  }
}
</style>