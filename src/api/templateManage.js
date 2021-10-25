import { axios } from '@/utils/axios'

// 获取公证产品列表
export async function getProductTemplateList(params) {
  return await axios(`org/org-template-productionId/${params.productionId}/${params.pageNum}/${params.pageSize}`)
}

// 获取公证产品模板类型
export async function getProductTemplateType() {
  return await axios('org/org-template-type')
}

// 模糊查询公证产品列表
export async function searchProductTemplateList(params) {
  return await axios(`org/org-template-fuzzy-query/${params.productionId}/${params.pageNum}/${params.pageSize}`, params.orgTemplateVO, { method: 'post' })
}

// 删除产品模板
export async function deleteProductTemplate(params) {
  return await axios(`org/del-org-template/${params.productionId}/${params.templateId}`, {}, { method: 'delete' })
}

// 删除通用产品模板
export async function deleteCommonProductTemplate(params) {
  return await axios(`org/del-org-common-template/${params.productionId}/${params.templateId}`, {}, { method: 'delete' })
}

// 批量删除产品模板
export async function deleteMultiProductTemplate(params) {
  return await axios(`org/del-org-template-list/${params.productionId}`, params.list, { method: 'delete' })
}

// 启用禁用产品模板
export async function updateProductState(params) {
  return await axios(`org/update-org-template1`, params, { method: 'post' })
}

// 获取添加模板媒介值
export async function getMedium() {
  return await axios(`org/template-get-medium`)
}

// 添加产品模板
export async function addProductTemplate(params) {
  return await axios(`org/add-org-template`, params, { method: 'post' })
}

// 获取公证处信息
export async function getOrgInfo() {
  return await axios(`org/user-org-id`)
}

// 根据模板id查询模板详细信息
export async function getTemplateInfo(params) {
  return await axios(`org/org-template-id/${params.templateId}`)
}

// 修改产品模板信息
export async function updateTemplateInfo(params) {
  return await axios('org/update-org-template', params, { method: 'post' })
}

// 获取产品下未使用的通用模板信息
export async function getUnusedTemplateInfo(params) {
  return await axios(`org/temp-common-list/${params.productionId}`)
}

// 产品添加未使用的通用模板
export async function saveUnusedTemplate(params) {
  return await axios(`org/org-template-common-re`, params, { method: 'post' })
}

// 分页查询机构下的通用模板
export async function getCommonTemplate(params) {
  return await axios(`org/org-template-isCommon/${params.pageNum}/${params.pageSize}`)
}

// 获取产品下的模板类型数量
export async function getCommonTemplateNum(params) {
  return await axios(`org/template-type-num`, params)
}
