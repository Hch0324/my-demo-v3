<template>
  <div class="form-page-container">
    <!-- 表单页面 -->
    <el-card class="form-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>表单示例</span>
        </div>
      </template>
      
      <el-steps :active="activeStep" simple>
        <el-step title="基本信息" />
        <el-step title="详细信息" />
        <el-step title="确认提交" />
      </el-steps>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="demo-ruleForm"
        size="default"
        style="margin-top: 30px"
      >
        <!-- 基本信息 -->
        <template v-if="activeStep === 0">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formData.userName" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" show-password />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
        </template>
        
        <!-- 详细信息 -->
        <template v-else-if="activeStep === 1">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
          </el-form-item>
          
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="formData.birthday" type="date" placeholder="请选择出生日期" />
          </el-form-item>
          
          <el-form-item label="所属部门" prop="department">
            <el-select v-model="formData.department" placeholder="请选择所属部门" style="width: 100%">
              <el-option label="技术部" value="tech" />
              <el-option label="市场部" value="market" />
              <el-option label="销售部" value="sales" />
              <el-option label="人事部" value="hr" />
              <el-option label="财务部" value="finance" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="职位" prop="position">
            <el-select v-model="formData.position" placeholder="请选择职位" style="width: 100%">
              <el-option label="经理" value="manager" />
              <el-option label="主管" value="supervisor" />
              <el-option label="专员" value="specialist" />
              <el-option label="助理" value="assistant" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="兴趣爱好" prop="hobbies">
            <el-checkbox-group v-model="formData.hobbies">
              <el-checkbox label="读书" />
              <el-checkbox label="音乐" />
              <el-checkbox label="电影" />
              <el-checkbox label="运动" />
              <el-checkbox label="旅行" />
              <el-checkbox label="游戏" />
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="个人简介" prop="introduction">
            <el-input v-model="formData.introduction" type="textarea" :rows="4" placeholder="请输入个人简介" />
          </el-form-item>
        </template>
        
        <!-- 确认提交 -->
        <template v-else-if="activeStep === 2">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ formData.userName }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ formData.email }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ formData.phone }}</el-descriptions-item>
            <el-descriptions-item label="真实姓名">{{ formData.realName }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ formData.gender === 'male' ? '男' : formData.gender === 'female' ? '女' : '其他' }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ formData.birthday }}</el-descriptions-item>
            <el-descriptions-item label="所属部门">
              {{ formData.department === 'tech' ? '技术部' : formData.department === 'market' ? '市场部' : formData.department === 'sales' ? '销售部' : formData.department === 'hr' ? '人事部' : '财务部' }}
            </el-descriptions-item>
            <el-descriptions-item label="职位">
              {{ formData.position === 'manager' ? '经理' : formData.position === 'supervisor' ? '主管' : formData.position === 'specialist' ? '专员' : '助理' }}
            </el-descriptions-item>
            <el-descriptions-item label="兴趣爱好" :span="2">
              {{ formData.hobbies.join('、') || '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="个人简介" :span="2">{{ formData.introduction || '无' }}</el-descriptions-item>
          </el-descriptions>
        </template>
        
        <!-- 表单操作按钮 -->
        <el-form-item>
          <el-button @click="handleResetForm">重置</el-button>
          <el-button type="primary" @click="handlePrev" v-if="activeStep > 0">上一步</el-button>
          <el-button type="primary" @click="handleNext" v-else-if="activeStep < 2">下一步</el-button>
          <el-button type="primary" @click="handleSubmit" v-else :loading="submitLoading">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'

// 激活的步骤
const activeStep = ref(0)

// 提交加载状态
const submitLoading = ref(false)

// 表单引用
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

// 表单数据
const formData = reactive({
  // 基本信息
  userName: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  
  // 详细信息
  realName: '',
  gender: 'male',
  birthday: '',
  department: '',
  position: '',
  hobbies: [] as string[],
  introduction: ''
})

// 表单验证规则
const formRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthday: [
    { required: true, message: '请选择出生日期', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请选择职位', trigger: 'change' }
  ]
}

// 上一步
const handlePrev = () => {
  activeStep.value--
}

// 下一步
const handleNext = async () => {
  if (activeStep.value === 0) {
    try {
      await formRef.value?.validateField(['userName', 'password', 'confirmPassword', 'email', 'phone'])
      activeStep.value++
    } catch (error) {
      console.log('验证失败:', error)
    }
  } else if (activeStep.value === 1) {
    try {
      await formRef.value?.validateField(['realName', 'gender', 'birthday', 'department', 'position'])
      activeStep.value++
    } catch (error) {
      console.log('验证失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    submitLoading.value = true
    
    // 这里可以调用API提交表单数据
    console.log('表单数据:', formData)
    
    ElMessage.success('表单提交成功')
    
    // 重置表单
    handleResetForm()
    activeStep.value = 0
  } catch (error) {
    ElMessage.error('表单提交失败')
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const handleResetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  
  // 重置数组和对象类型的字段
  formData.hobbies = []
  activeStep.value = 0
}
</script>

<style scoped lang="scss">
.form-page-container {
  padding: 0;
}

.form-card {
  max-width: 800px;
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

.el-form-item {
  margin-bottom: 20px;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  
  .el-checkbox {
    margin-right: 0;
  }
}
</style>
