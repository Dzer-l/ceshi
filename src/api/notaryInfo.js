import { axios } from '@/utils/axios'

// 获取公证处详情
export async function getNotaryInfo() {
  return await axios('org/selectOrgInfo')
}

// 获取办证区域
export async function getRegionList() {
  return await axios('org/regionTree')
}

// 上传图片
export async function uploadFile(params) {
  return await axios('org/uploadFile', params, { method: 'post' })
}

// 删除办证点
export async function deleteNotaryOffice(params) {
  return await axios('org/delectOrgOffice', params)
}

// 修改办证点信息
export async function updateNotaryInfo(params) {
  return await axios('org/updateOrgInfo', params, { method: 'post' })
}
// 上传印章
export async function uploadSealFile(params) {
  return await axios('org/upload-seal-file', params, { method: 'post' })
}
// 印章base64
export async function SealFileBase(params) {
  return await axios('org/org-official—seal—file', params, { method: 'get' })
}
