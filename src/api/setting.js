import { axios } from '@/utils/axios'

export async function getWebsiteNavigation(params) {
  return await axios(`org/org-navigation-tree`, params)
}

export async function deleteWebsiteNavigation(params) {
  return await axios(`org/org-navigation/${params.id}`, {}, { method: 'DELETE' })
}

export async function modifyTheNavigationBarStatus(params) {
  return await axios(`org/org-navigation-open-status`, params, { method: 'PUT' })
}

export async function sort(params) {
  return await axios(`org/org-navigation/list/sort`, params, { method: 'PUT' })
}

export async function getWebsiteRim(params) {
  return await axios(`org/org-carousel`, params)
}

export async function deleteWebsiteRim(params) {
  return await axios(`org/org-carousel/${params.id}`, {}, { method: 'DELETE' })
}

export async function modifyTheRimBarStatus(params) {
  return await axios(`org/org-carousel-open-status`, params, { method: 'PUT' })
}

export async function rimSort(params) {
  return await axios(`org/org-carousel/list/sort`, params, { method: 'PUT' })
}

export async function uploadImage(params) {
  return await axios(`org/org-carousel-upload`, params, { method: 'POST' })
}
export async function getPageSetList() {
  return await axios(`org/org-home-page-conf`)
}
export async function addTemplate(params) {
  return await axios(`org/org-home-page-conf`, params, { method: 'POST' })
}
export async function homePageUploadImage(params) {
  return await axios(`org/org-home-page-conf-upload`,params,{ method: 'POST'})
}
export async function getAllocationMap(params) {
  return await axios(`org/org-home-page-conf-file`,params)
}
export async function editTemplate(params) {
  return await axios(`org/org-home-page-conf`, params, { method: 'PUT' })
}
export async function templateSort(params){
  return await axios(`org/org-home-page-conf/list/sort`, params, { method: 'PUT' })
}
export async function editPutawayState(params) {
  return await axios(`org/org-home-page-conf-open-status`, params, { method: 'PUT' })
}
export async function getPreviewConfiguration() {
  return await axios(`org/preview-org-home-page-conf`)
}
//判断公章是否上传
export async function haveSeal(params){
  return await axios(`org/check-official-seal-file`,params,{ method: 'get' })
}
// 上传印章
export async function uploadSealFile(params) {
  return await axios('org/upload-seal-file', params, { method: 'post' })
}
// 印章base64
export async function SealFileBase(params) {
  return await axios('org/org-user—seal—file', params, { method: 'get' })
}
//预览签章
export async function previewSeal(params) {
  return await axios('org/preview-seal-file', params, { method: 'get' })
}
// 编辑印章
export async function editSealFile(params) {
  return await axios('org/edit-seal-file', params, { method: 'put' })
}

