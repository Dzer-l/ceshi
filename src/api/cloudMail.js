import { axios } from '@/utils/axios'

export async function getCloudListData(params) {
  return await axios(`org/evidence-query/${params.pageNum}/${params.pageSize}`, params, { method: 'POST' })
}
// 获取详情头部信息
export async function getCloudDateil(params) {
  return await axios(`org/evidence-query/${params.evidId}/`, {}, { method: 'GET' })
}
// 获取费用信息
export async function getCloudMailDateil(params) {
  return await axios(`org/evid-mail/${params.evidId}/`, {}, { method: 'GET' })
}
// 获取取证账号信息
export async function getCloudAccountInfo(params) {
  return await axios(`org/evid-user-info/${params.evidId}/`, {}, { method: 'GET' })
}
// 获取案件信息中当事人信息
export async function getCloudPersonInfo(params) {
  return await axios(`org/mail-evid-person/${params.evidId}/${params.pageNum}/${params.pageSize}/`, {}, { method: 'GET' })
}
// 获取证据文件列表
export async function getEvidMaterialList(params) {
  return await axios(`org/mail-evid-material/${params.evidId}/`, {}, { method: 'GET' })
}
// 获取物流信息
export async function getLogisticsList(params) {
  return await axios(`org/mail-evid-express-info2/${params.evidId}/`, {}, { method: 'GET' })
}

// 获取受送达人信息
export async function getPersonRreceiptInfo(params) {
  return await axios(`org/mailevid-person-receipt/${params.evidId}/`, {}, { method: 'GET' })
}

// 获取城市三级联动数据
export async function getCityData() {
  return await axios(`org/region-tree`, {}, { method: 'GET' })
}
// 获取物流详情
export async function getLogisticsDateil(params) {
  return await axios(`org/evid-ems-info-templateno?tempOrderNo=${params.tempOrderNo}`, {}, { method: 'GET' })
}
// 获取物流详情
export async function getLogisticsDateil2(params) {
  return await axios(`org/evid-ems-info-templateno2?tempOrderNo=${params.tempOrderNo}`, {}, { method: 'GET' })
}

// 点击呼叫快递接口
export async function mailOrder(params) {
  return await axios(`org/evid-ems2`, params, { method: 'POST' })
}

// 回寄退件快递接口
export async function mailOrderBack(params) {
  return await axios(`org/evid-ems2`, params, { method: 'POST' })
}

export async function getEntryMailList(params) {
  return await axios(`org/mail-evid-express-list/${params.evidId}/${params.pageNum}/${params.pageSize}`, {}, { method: 'GET' })
}

export async function downloadEntryFile(params) {
  return await axios(`org/download-order-evid-re-file?orderId=${params.orderId}&orderEvidReIdArray=${params.orderEvidReIdArray}`, {}, { method: 'GET', responseType: 'blob' })
}

export async function downloadEntry(params) {
  return await axios(`org/downLoad-evid-file-fileType/${params.evidId}/${params.fileType}`, {}, { method: 'GET', responseType: 'blob' })
}
// 提交编辑后的费用
export async function submitEditCost(params) {
  return await axios(`org/update-evidMail`, params, { method: 'POST' })
}

export async function getCostInfo(params) {
  return await axios(`org/mail-evid-cost/${params.evidMailId}`, {}, { method: 'GET' })
}

export async function modifyCostInformation(params) {
  return await axios(`org/mail-evid-cost`, params, { method: 'POST' })
}

export async function printExpressSheet(params) {
  return await axios(`org/package-print/${params.evidId}/${params.mailEvidExpressInfoId}`, {}, { method: 'GET' })
}
// 获取订单详情
export async function getEntryDateil(params) {
  return await axios(`org/order/${params.orderId}`, {}, { method: 'GET' })
}
// 查询账号信息
export async function getAccountInfo(params) {
  return await axios(`org/user-account/${params.accountId}`, {}, { method: 'GET' })
}
// 获取当事人列表
export async function getProposeInfo(params) {
  return await axios(`org/order-propose/${params.orderId}`, {}, { method: 'GET' })
}

export async function getMailCostInfo(params) {
  return await axios(`org/mail-order-notary-info-cost/${params.orderId}`, {}, { method: 'GET' })
}

export async function getProposeDateailInfo(params) {
  return await axios(`org/order-propose-detail/${params.orderProposeId}`, {}, { method: 'GET' })
}
// 获取材料库
export async function getMaterialDepot(params) {
  return await axios(`org/org-material-list/${params.orderId}?materialName=${params.materialName}`, {}, { method: 'GET' })
}
// 修改订单基本信息
export async function modificationOrderInfo(params) {
  return await axios(`org/update-order-info`, params, { method: 'POST' })
}

// 确认订单费用已支付 / 确认变更为线下支付
export async function sendNotaryPaper(data) {
  return await axios(`org/send-notary-paper?orderId=${data.orderId}&orderStatus=${data.orderStatus}`, {}, { method: 'GET' })
}

// 修改当事人信息
export async function modificationPartiesInfo(params) {
  return await axios(`org/update-order-propose-info`, params, { method: 'POST' })
}

// 修改订单费用信息
export async function modificationCostInfo(params) {
  return await axios(`org/update-notary-cost-detail2/${params.orderId}`, params, { method: 'POST' })
}
// 获取文书材料列表
export async function getDocumentMaterialList(params) {
  return await axios(`org/mail-order-document-list?orderId=${params.orderId}`, {}, { method: 'GET' })
}

export async function getLogisticInfo(params) {
  return await axios(`org/mail-order-express-send2?orderNum=${params.orderNum}`, {}, { method: 'GET' })
}

export async function getFileList(params) {
  return await axios(`org/order-evid-re-file-list/${params.orderId}/${params.pageNum}/${params.pageSize}`, {}, { method: 'GET' })
}

//  获取领证信息
export async function getReceiverInfo(params) {
  return await axios(`org/select-order-offline-receive?orderNum=${params.orderNum}`, {}, { method: 'GET' })
}

// 获取收件人信息
export async function getRecipientsInfo(params) {
  return await axios(`org/select-order-express-send2?orderNum=${params.orderNum}`, {}, { method: 'GET' })
}

// 修改领证人信息
export async function modificationReceiveInfo(params) {
  return await axios(`org/update-order-offline-receive`, params, { method: 'POST' })
}

// 修改收件人信息
export async function modificationRecipientsInfo(params) {
  return await axios(`org/update-order-express-send2`, params, { method: 'POST' })
}

// 添加收件人信息
export async function addnRecipientsInfo(params) {
  return await axios(`org/add-order-express2`, params, { method: 'POST' })
}

// 获取证据材料列表
export async function getEvidenceMaterial(params) {
  return await axios(`org/mail-order-material-list/${params.orderId}`, {}, { method: 'GET' })
}

// 获取订单所有关系人下的材料类型及材料文件
export async function getAllTypeMaterial(params) {
  return await axios(`org/order-proposer-material-all-proposer/${params.orderId}`, {}, { method: 'GET' })
}

// 获取订单搜索关系人下的材料类型及材料文件
export async function getAloneTypeMaterial(params) {
  return await axios(`org/order-proposer-material-proposerId/${params.orderId}/${params.proposerId}`, {}, { method: 'GET' })
}
// 预览图片
export async function previewMaterials(params) {
  return await axios('org/order-material-preview-img', params)
}

// 审核单个订单材料
export async function reviewSingleMaterial(params) {
  return await axios('org/update-order-proposer-material', params, { method: 'POST' })
}

// 审核所有订单材料
export async function reviewAllMaterial(params) {
  return await axios(`org/order-material-approved/${params.orderId}`, {}, { method: 'GET' })
}

export async function supplementaryMaterials(params) {
  return await axios(`org/order-need-material-update`, params, { method: 'POST' })
}

// 删除证据材料
export async function DeleteMaterials(params) {
  return await axios(`org/delete-order-proposer-re-file?id=${params.id}`, {}, { method: 'DELETE' })
}

// 删除文书材料
export async function DeleteWritMaterials(params) {
  return await axios(`org/order-document/${params.id}`, {}, { method: 'DELETE' })
}

// 查询订单是否具备审核通过的条件
export async function determineWhether(params) {
  return await axios(`org/order-passing-check/${params.orderId}`, {}, { method: 'GET' })
}

// 材料库添加材料
export async function addDetermine(params) {
  return await axios(`org/add-org-need-material/${params[0].orderId}`, params, { method: 'POST' })
}

// 添加临时材料
export async function addNeedDetermine(params) {
  return await axios(`org/add-order-need-material/${params[0].orderId}`, params, { method: 'POST' })
}

// 获取公证处所有的办证点
export async function getAllAddress() {
  return await axios('org/get-org-office-list', { method: 'get' })
}

// 发送领证短信
export async function sendTextMessage(params) {
  return await axios(`org/order-sms-send/${params.orderId}`, {}, { method: 'GET' })
}

export async function previewDocumentary(params) {
  return await axios(`org/order-document-preview/${params.orderDocumentId}`, {}, { method: 'GET' })
}
// 订单新增关系人材料
export async function addApplicationMaterial(params) {
  return await axios(`org/save-order-proposer-re-file-list`, params, { method: 'post' })
}

// 下载
export async function downloadFile(params) {
  return await axios(`org/download-material?orderId=${params.orderId}&documentId=${params.id}&downloadType=${params.downloadType}`, {}, { method: 'GET' })
}

export async function getOrgInfo(params) {
  return await axios(`org/evid-org-office-info/${params.evidId}`, {}, { method: 'GET' })
}
// 复制签署码
export async function SignedCodeCopy(params) {
  return await axios(`org/QRCode?orderId=${params.orderId}&userType=${params.userType}&qrCodeName=${params.qrCodeName}`, {}, { method: 'GET' })
}

// 获取登录人员是否有操作权限
export async function getJurisdiction(params) {
  return await axios(`org/query-order-jurisdiction/${params.orderId}`, {}, { method: 'GET' })
}

export async function getEvidJurisdiction(params) {
  return await axios(`org/query-evid-jurisdiction/${params.evidId}`, {}, { method: 'GET' })
}

// 查询机构关系人
export async function getEnterprisePrivyInfo(params) {
  return await axios(`org/query-account-userPersonbook/${params.accountId}`, {}, { method: 'GET' })
}

// 查询机构关系人
export async function cancelSentStem(params) {
  return await axios(`org/evid-ems-cancel2/${params.evidMailId}`, {}, { method: 'post' })
}

export async function getShippingInformation(params) {
  return await axios(`org/evidence-query/${params.evidId}`, {}, { method: 'GET' })
}

export async function sendSmsToTheParties(params) {
  return await axios(`org/send-url-by-sms?orderId=${params.orderId}&confType=1`, {}, { method: 'GET' })
}

// 获取承办人
export async function getOperator() {
  return await axios(`org/org-user-list`, {}, { method: "get" })
}

// 获取当前公证处的办证点
export async function getOrgOfficeList(params) {
  return await axios(`org/org-office-by-orgId`, {}, { method: "get" })
}

// 导出订单
export async function exportPackageRecordExcel(data) {
  return await axios(`org/evidence-excel `, data, { method: 'POST', responseType: 'blob' })
}

// 获取签收寄函照片需要上传材料类型
export async function getEvidSignSendNeedMaterial(data) {
  return await axios(`org/get-evid-sign-send-need-material`, data)
}

// 签收照片 寄函图片 退回包裹图片 上传
export async function signSendFileUpload(data) {
  return await axios(`org/sign-send-file-upload`, data, { method: "POST" })
}

// 签收照片 寄函图片 退回包裹图片 上传
export async function getMailEvidReceivePersonInfo(data) {
  return await axios(`org/getMailEvidReceivePersonInfo`, data)
}

// 保存图片
export async function saveMailPicture(data) {
  return await axios(`org/save-mail-picture`, data, { method: "POST" })
}

// 修改证据费用信息及证据状态
export async function updateEvidMail(data) {
  return await axios(`org/update-evidMail`, data, { method: "POST" })
}

// 证据物流送达信息列表
export async function mailEvidExpressInfo(params) {
  return await axios(`org/mail-confirm-express-info2/${params}`, {})
}

// 确认全部物流送达
export async function updateMailConfirmExpressInfo(data) {
  return await axios(`org/update-mail-confirm-express-info`, data, { method: "POST" })
}

// 生成二维码-寄函签收图片
export async function evidSignUploadQrcode(data) {
  return await axios(`org/evid-sign-send-upload-qr-code`, data, { responseType: 'blob' })
}

// 获取h5上传的文件流
export async function getH5FileStream(data) {
  return await axios(`org/get-h5-file-stream/?evidId=${data.evidId}`, data, { method: "POST" })
}

// 删除h5图片
export async function delH5File(data) {
  return await axios(`org/del-h5-file/${data.evidMailId}`, data, { method: 'delete' })
}

// 回退寄件
export async function getBackMailList(params) {
  return await axios(`org/mail-evid-express-lists/${params.evidId}/${params.pageNum}/${params.pageSize}`, {}, { method: 'GET' })
}
