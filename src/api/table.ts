import request from '@/utils/request'
import type { TableListResponse } from '@/types/mock'

// 获取表格数据
export const getTableList = (params: any): Promise<TableListResponse> => {
  return request.get('/table/list', { params })
}

// 删除表格数据
export const deleteTableItem = (id: number) => {
  return request.delete(`/table/delete/${id}`)
}

// 批量删除
export const batchDeleteTable = (ids: number[]) => {
  return request.post('/table/batch-delete', { ids })
}

// 更新表格数据
export const updateTableItem = (id: number, data: any) => {
  return request.put(`/table/update/${id}`, data)
}

// 添加表格数据
export const addTableItem = (data: any) => {
  return request.post('/table/add', data)
}