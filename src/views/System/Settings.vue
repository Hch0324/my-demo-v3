<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="basicSettings" label-width="120px" size="default">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            
            <el-form-item label="系统版本">
              <el-input v-model="basicSettings.systemVersion" placeholder="请输入系统版本" readonly />
            </el-form-item>
            
            <el-form-item label="版权信息">
              <el-input v-model="basicSettings.copyright" type="textarea" :rows="3" placeholder="请输入版权信息" />
            </el-form-item>
            
            <el-form-item label="联系方式">
              <el-input v-model="basicSettings.contact" placeholder="请输入联系方式" />
            </el-form-item>
            
            <el-form-item label="是否开启注册">
              <el-switch v-model="basicSettings.enableRegistration" />
            </el-form-item>
            
            <el-form-item label="是否开启验证码">
              <el-switch v-model="basicSettings.enableCaptcha" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置" name="email">
          <el-form :model="emailSettings" label-width="120px" size="default">
            <el-form-item label="SMTP服务器">
              <el-input v-model="emailSettings.smtpServer" placeholder="请输入SMTP服务器地址" />
            </el-form-item>
            
            <el-form-item label="SMTP端口">
              <el-input-number v-model="emailSettings.smtpPort" :min="0" :max="65535" />
            </el-form-item>
            
            <el-form-item label="发件人邮箱">
              <el-input v-model="emailSettings.senderEmail" placeholder="请输入发件人邮箱" />
            </el-form-item>
            
            <el-form-item label="发件人名称">
              <el-input v-model="emailSettings.senderName" placeholder="请输入发件人名称" />
            </el-form-item>
            
            <el-form-item label="用户名">
              <el-input v-model="emailSettings.username" placeholder="请输入SMTP用户名" />
            </el-form-item>
            
            <el-form-item label="密码">
              <el-input v-model="emailSettings.password" type="password" placeholder="请输入SMTP密码" show-password />
            </el-form-item>
            
            <el-form-item label="是否使用SSL">
              <el-switch v-model="emailSettings.useSSL" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveEmailSettings">保存设置</el-button>
              <el-button @click="handleTestEmail">测试发送</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="securitySettings" label-width="120px" size="default">
            <el-form-item label="登录失败次数限制">
              <el-input-number v-model="securitySettings.loginFailLimit" :min="0" :max="20" />
            </el-form-item>
            
            <el-form-item label="密码有效期(天)">
              <el-input-number v-model="securitySettings.passwordExpireDays" :min="0" :max="365" />
            </el-form-item>
            
            <el-form-item label="是否开启双因素认证">
              <el-switch v-model="securitySettings.enableTwoFactor" />
            </el-form-item>
            
            <el-form-item label="会话超时时间(分钟)">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="5" :max="720" />
            </el-form-item>
            
            <el-form-item label="是否记录操作日志">
              <el-switch v-model="securitySettings.enableOperationLog" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSaveSecuritySettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 激活的标签页
const activeTab = ref('basic')

// 基本设置
const basicSettings = reactive({
  systemName: 'Vue Admin System',
  systemVersion: '1.0.0',
  copyright: '© 2024 Vue Admin System. All rights reserved.',
  contact: 'admin@example.com',
  enableRegistration: true,
  enableCaptcha: true
})

// 邮件设置
const emailSettings = reactive({
  smtpServer: 'smtp.example.com',
  smtpPort: 465,
  senderEmail: 'noreply@example.com',
  senderName: 'Vue Admin System',
  username: 'noreply@example.com',
  password: '',
  useSSL: true
})

// 安全设置
const securitySettings = reactive({
  loginFailLimit: 5,
  passwordExpireDays: 90,
  enableTwoFactor: false,
  sessionTimeout: 30,
  enableOperationLog: true
})

// 保存基本设置
const handleSaveBasicSettings = () => {
  // 这里可以调用API保存设置
  ElMessage.success('基本设置保存成功')
}

// 保存邮件设置
const handleSaveEmailSettings = () => {
  // 这里可以调用API保存设置
  ElMessage.success('邮件设置保存成功')
}

// 测试发送邮件
const handleTestEmail = () => {
  // 这里可以调用API测试发送邮件
  ElMessage.success('邮件发送测试成功')
}

// 保存安全设置
const handleSaveSecuritySettings = () => {
  // 这里可以调用API保存设置
  ElMessage.success('安全设置保存成功')
}

onMounted(() => {
  // 这里可以调用API加载设置
  console.log('Settings mounted')
})
</script>

<style scoped lang="scss">
.settings-container {
  padding: 0;
}

.settings-card {
  max-width: 1000px;
  margin: 0 auto;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color-primary);
}

.settings-tabs {
  margin-top: 20px;
  
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
  
  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
