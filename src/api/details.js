import { axios } from '@/utils/axios'
// 订单列表数据获取
export async function getDetailsList(params) {
  return await axios('org/trademark-order-list', params, { method: 'post' })
}
// 订单详情头部数据获取
export async function getDetailsHead(params) {
  return await axios('org/get-order-detail', params)
}
// 订单详情商标信息数据获取
export async function getReginsterData(params) {
  return await axios('org/get-order-trademark-detail', params)
}
// 订单详情申请人信息数据获取
export async function getApplicantInfo(params) {
  return await axios('org/get-order-proposer-detail', params)
}
// 签署材料数据获取
export async function getSignedInfo(params) {
  return await axios('org/sign-order-document-list', params)
}

export async function getMaterialList(params) {
  return await axios('org/order-material-list', params)
}

export async function getMateriaProposerlList(params) {
  return await axios(`org/order-proposer-material-preview/${params.id}`)
}

// 订单详情快递信息数据获取
export async function getExpressInfo(params) {
  return await axios('org/get-order-express-send', params)
}
// 获取城市三级联动区域树
export async function getCityData() {
  return await axios('org/region-tree')
}
// 订单详情领证信息数据获取
export async function getLicenseInfo(params) {
  return await axios('org/get-order-offline-receive', params)
}
// 修改收件人信息数据
export async function changeInformation(params) {
  return await axios('org/update-order-express', params, { method: 'put' })
}
// 预约线下领证时间
export async function appointmentTime(params) {
  return await axios('org/appointment-time', params, { method: 'put' })
}
// 获取公证处所有的办证点
export async function getAllAddress() {
  return await axios('org/org-office', { method: 'get' })
}
// 订单详情修改订单状态
export async function updateOrderSta(params) {
  return await axios('org/update-order-status', params, { method: 'put' })
}
// 订单详情更新线下领证
export async function offlineReceive(params) {
  return await axios('org/order-offline-receive', params, { method: 'put' })
}
// 预览图片
export async function previewMaterials(params) {
  return await axios('org/order-material-preview-img', params)
}
// 订单详情新增订单备注数据
export async function addRemark(params) {
  return await axios('org/save-order-remark', params, { method: 'post' })
}
// 订单详情备注信息数据获取
export async function getRemark(params) {
  return await axios('org/order-remark', params)
}
// 修改卷宗号
export async function modificationFile(params) {
  return await axios('org/update-order-dossier-num', params, { method: 'put' })
}

export async function downloadMaterial(params) {
  return await axios('org/download-material', params)
}
// 预览材料
export async function getFileImg(data) {
  return await axios(`org/order-document-preview/${data.id}`)
}
// 获取快递物流详情
export async function getSendDetail(params) {
  return await axios(`org/get-send-detail`, params)
}
// 原公众号信息数据获取
export async function getOldAndNo(params) {
  return await axios(`org/get-order-original-official-account`, params)
}
// 目标公众号信息数据获取
export async function getNewAndNo(params) {
  return await axios(`org/get-order-target-official-account`, params)
}
// 根据城市最下级的code获取城市三级联动绑定的code
export async function getCityCode(params) {
  return await axios(`org/region?code=${params.code}`)
}
