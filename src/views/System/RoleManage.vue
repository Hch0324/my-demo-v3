<template>
  <div class="role-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="handleAdd">新增角色</el-button>
        </div>
      </template>
      
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Role {
  id: number
  name: string
  code: string
  description: string
  createTime: string
}

const roleList = ref<Role[]>([
  {
    id: 1,
    name: '管理员',
    code: 'admin',
    description: '系统管理员，拥有所有权限',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    description: '普通用户，拥有基本权限',
    createTime: '2024-01-02 11:00:00'
  }
])

const handleAdd = () => {
  ElMessage.success('新增角色功能开发中...')
}

const handleEdit = (row: Role) => {
  ElMessage.success(`编辑角色: ${row.name}`)
}

const handleDelete = (row: Role) => {
  ElMessageBox.confirm(
    `确定要删除角色 "${row.name}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped lang="scss">
.role-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>