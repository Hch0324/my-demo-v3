<template>
  <div class="table-list-container">
    <!-- 搜索和操作栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="请输入用户ID"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.userName"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchForm.email"
            placeholder="请输入邮箱"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="searchForm.role"
            placeholder="请选择角色"
            clearable
            style="width: 120px"
          >
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        :data="tableData"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="userName" label="用户名" min-width="150" sortable show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="150" show-overflow-tooltip />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'">
              {{ row.role === 'admin' ? '管理员' : row.role === 'editor' ? '编辑' : '用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="150" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="200" sortable />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)" size="small">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="success" link @click="handleView(row)" size="small">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)" size="small">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="用户详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detailData.userName }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailData.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detailData.department }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="detailData.role === 'admin' ? 'danger' : detailData.role === 'editor' ? 'warning' : 'info'">
            {{ detailData.role === 'admin' ? '管理员' : detailData.role === 'editor' ? '编辑' : '用户' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === 'active' ? 'success' : 'danger'">
            {{ detailData.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElForm } from 'element-plus'
import { Search, Refresh, Plus, Delete, Edit, View, Download } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  userId: '',
  userName: '',
  email: '',
  status: '',
  role: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    userName: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'admin',
    status: 'active',
    department: '技术部',
    createTime: '2024-01-01 10:00:00',
    remark: '系统管理员'
  },
  {
    id: 2,
    userName: 'editor1',
    email: 'editor1@example.com',
    phone: '13800138001',
    role: 'editor',
    status: 'active',
    department: '编辑部',
    createTime: '2024-01-02 11:00:00',
    remark: '内容编辑'
  },
  {
    id: 3,
    userName: 'user1',
    email: 'user1@example.com',
    phone: '13800138002',
    role: 'user',
    status: 'active',
    department: '市场部',
    createTime: '2024-01-03 14:00:00',
    remark: '普通用户'
  },
  {
    id: 4,
    userName: 'user2',
    email: 'user2@example.com',
    phone: '13800138003',
    role: 'user',
    status: 'inactive',
    department: '销售部',
    createTime: '2024-01-04 09:00:00',
    remark: '已禁用用户'
  },
  {
    id: 5,
    userName: 'editor2',
    email: 'editor2@example.com',
    phone: '13800138004',
    role: 'editor',
    status: 'active',
    department: '编辑部',
    createTime: '2024-01-05 16:00:00',
    remark: '高级编辑'
  }
])

const loading = ref(false)
const selectedRows = ref([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 50
})

// 对话框配置
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const submitLoading = ref(false)

// 表单引用
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

// 表单数据
const formData = reactive({
  id: '',
  userName: '',
  email: '',
  phone: '',
  department: '',
  role: 'user',
  status: 'active',
  remark: ''
})

// 详情数据
const detailData = reactive({
  id: '',
  userName: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  status: '',
  createTime: '',
  remark: ''
})

// 表单验证规则
const formRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  // 这里可以调用API获取数据
  console.log('搜索条件:', searchForm)
}

// 重置
const handleReset = () => {
  searchForm.userId = ''
  searchForm.userName = ''
  searchForm.email = ''
  searchForm.status = ''
  searchForm.role = ''
  handleSearch()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(formData, row)
}

// 查看
const handleView = (row: any) => {
  Object.assign(detailData, row)
  detailVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 这里可以调用API删除数据
    ElMessage.success('删除成功')
    // 更新表格数据
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      pagination.total--
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 这里可以调用API批量删除数据
    ElMessage.success('批量删除成功')
    // 更新表格数据
    const ids = selectedRows.value.map((row: any) => row.id)
    tableData.value = tableData.value.filter(item => !ids.includes(item.id))
    pagination.total -= ids.length
    selectedRows.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 状态变更
const handleStatusChange = async (row: any) => {
  try {
    // 这里可以调用API更新状态
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
    // 回滚状态
    row.status = row.status === 'active' ? 'inactive' : 'active'
  }
}

// 导出数据
const handleExport = () => {
  ElMessage.success('数据导出功能开发中...')
}

// 表格选择变化
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // 这里可以调用API获取数据
}

// 页码变化
const handleCurrentChange = (page: number) => {
  pagination.current = page
  // 这里可以调用API获取数据
}

// 重置表单
const resetForm = () => {
  formData.id = ''
  formData.userName = ''
  formData.email = ''
  formData.phone = ''
  formData.department = ''
  formData.role = 'user'
  formData.status = 'active'
  formData.remark = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 对话框关闭
const handleDialogClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()
    
    submitLoading.value = true
    
    if (dialogType.value === 'add') {
      // 这里可以调用API新增数据
      ElMessage.success('新增成功')
      // 更新表格数据
      const newUser = {
        id: Date.now(),
        ...formData,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      tableData.value.unshift(newUser)
      pagination.total++
    } else {
      // 这里可以调用API编辑数据
      ElMessage.success('编辑成功')
      // 更新表格数据
      const index = tableData.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        tableData.value[index] = { ...tableData.value[index], ...formData }
      }
    }
    
    dialogVisible.value = false
  } catch (error: any) {
    if (error === false) {
      // 表单验证失败
      return
    }
    ElMessage.error(dialogType.value === 'add' ? '新增失败' : '编辑失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  // 这里可以调用API获取数据
  console.log('TableList mounted')
})
</script>

<style scoped lang="scss">
.table-list-container {
  padding: 0;
}

.search-card {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.search-form {
  margin-bottom: 20px;
}

.operation-bar {
  padding-top: 20px;
  border-top: 1px solid var(--border-color-lighter);
}

.table-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .search-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  
  .operation-bar {
    .el-button {
      margin-bottom: 10px;
    }
  }
}
</style>
