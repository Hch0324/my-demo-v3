import request from '@/utils/request'

// 获取公告列表
export const getNoticeList = (params?: any) => {
  return request({
    url: '/api/notice/list',
    method: 'get',
    params
  })
}

// 获取公告详情
export const getNoticeDetail = (id: string | number) => {
  return request({
    url: `/api/notice/${id}`,
    method: 'get'
  })
}

// 创建公告
export const createNotice = (data: any) => {
  return request({
    url: '/api/notice',
    method: 'post',
    data
  })
}

// 更新公告
export const updateNotice = (id: string | number, data: any) => {
  return request({
    url: `/api/notice/${id}`,
    method: 'put',
    data
  })
}

// 删除公告
export const deleteNotice = (id: string | number) => {
  return request({
    url: `/api/notice/${id}`,
    method: 'delete'
  })
}

// 批量删除公告
export const batchDeleteNotice = (ids: (string | number)[]) => {
  return request({
    url: '/api/notice/batch',
    method: 'delete',
    data: {
      ids
    }
  })
}
