import { axios } from '@/utils/axios'

// 删除订单关系人
export async function deleteProposer(params) {
  return await axios(`org/del-order-proposer/${params.orderProposerId}`, {}, { method: 'DELETE' })
}

// 上传支付二维码
export async function uploadPaymentQrCode(params) {
  return await axios(`org/upload-order-pay-qr-code/${params.orderId}`, params.formData, { method: 'POST' })
}

export async function addARelational(params) {
  return await axios(`org/add-order-proposer-info/${params.orderId}`, params, { method: 'POST' })
}

export async function getUrbanAreaTree() {
  return await axios(`org/region-tree`, {}, { method: 'GET' })
}

export async function getOrderPayQrCode(params) {
  return await axios(`org/order-pay-qr-code/${params.orderId}`, {}, { method: 'GET' })
}

export async function getAListOfOrganizers(params) {
  return await axios(`org/org-user-list1`, {}, { method: 'GET' })
}

// 修改卷宗信息
export async function modifyVolumeInformation(params) {
  return await axios(`org/update-order-dossier`, params, { method: 'POST' })
}

// 获取卷宗信息
export async function getVolumeInformation(params) {
  return await axios(`org/order-dossier/${params.orderId}`, {}, { method: 'GET' })
}

// 获取房产信息
export async function getRealEstateInformation(params) {
  return await axios(`org/house-entrust/${params.orderId}`, {}, { method: 'GET' })
}

// 编辑房产信息
export async function editPropertyInformation(params) {
  return await axios(`org/update-house-entrust`, params, { method: 'POST' })
}

// 获取电子公证书列表
export async function getAListOfElectronicsCertificates(params) {
  return await axios(`org/notary-paper-list/${params.orderId}`, {}, { method: 'GET' })
}

// 设置订单承办人
export async function setTheOrderHandler(params) {
  return await axios(`org/order-accept_sys_user/${params.orderId}/${params.orgUserId}`, {}, { method: 'POST' })
}

// 获取订单操作权限
export async function getOrderOperationPermissions(params) {
  return await axios(`org/order-auth/${params.orderId}`, {}, { method: 'GET' })
}

// 获取电子公证书预览图
export async function getAnElectricalCertificatePreview(params) {
  return await axios(`org/notary-paper-preview/${params.notaryPaperId}`, {}, { method: 'GET' })
}

// 下载电子公证书文件
export async function downloadElectricCertificateDocument(params) {
  return await axios(`org/downLoad-notary-paper/${params.orderId}/${params.notaryPaperId}`, {}, { method: 'GET', responseType: 'blob' })
}

// 盖章签署接口
export async function gateSignedInterface(params) {
  return await axios(`org/sign-notary-paper?orderId=${params.orderId}&notaryPaperId=${params.notaryPaperId}`, {}, { method: 'GET' })
}

// 校验关系人信息
export async function checkRelationalPersonInformation(params) {
  return await axios(`org/check-order-proposer-info?proposerArray=${params}`, {}, { method: 'GET' })
}

// 修改当事人信息
export async function modificationPartiesInfo(params) {
  return await axios(`org/update-order-propose-info`, params, { method: 'POST' })
}

// 获取文书签署信息
export async function getNotaryPaperSignRegion(notaryPaperId) {
  return await axios(`org/notary-paper-sign-region?notaryPaperId=${notaryPaperId}`, {}, { method: 'GET' })
}

// 修改电子公证书签名区域
export async function updateNotaryPaperSignRegion(data) {
  return await axios(`org/notary-paper-sign-region`, data, { method: 'POST' })
}

// 获取预览合同图片base64
export async function notaryPaperPreviewImg(id) {
  return await axios(`org/notary-paper-preview-img?id=${id}`, {}, { method: 'GET' })
}

// 删除文书
export async function notaryPaper(id) {
  return await axios(`org/notary-paper/${id}`, {}, { method: 'DELETE' })
}

// 审核合同信息 0未审核  1审核通过  2审核不通过
export async function checkingContractInfo(data) {
  return await axios(`org/checking-contract-info`, data, { method: 'PUT' })
}

// 审核通过通知公积金中心
export async function sendAuditPassTemplate(data) {
  return await axios(`org/send-audit-pass-template?orderId=${data.orderId}`, {}, { method: 'GET' })
}

// 审核不通过通知公积金中心
export async function sendAuditNotPassReason(data) {
  return await axios(`org/send-audit-not-pass-reason?orderId=${data.orderId}&reason=${data.reason}`, {}, { method: 'GET' })
}

// 获取合同状态
export async function contractStatus(orderId) {
  return await axios(`org/contract-status/${orderId}`, {}, { method: 'GET' })
}
