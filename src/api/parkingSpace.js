import { axios } from '@/utils/axios'

// 车位登记列表
export async function defenseParkingRegisterList(data) {
  return await axios(`org/defense-parking-register-list`, data, { method: 'POST' })
}

// 车位登记详情
export async function defenseParkingRegisterDetail(registerId) {
  return await axios(`org/defense-parking-register-detail/${registerId}`, {}, { method: 'GET' })
}

// 获取承办人
export async function getOperator() {
  return await axios(`org/org-user-list`, {}, { method: "get" })
}

// 车位登记车位信息详情
export async function defenseParkingInfoDetail(data) {
  return await axios(`org/defense-parking-info-detail/${data.registerId}/${data.pageNum}/${data.pageSize}`, {}, { method: 'GET' })
}

// 导出车位登记记录
export async function downloadParkingOrder(data) {
  return await axios(`org/download-parking-order/${data.startTime}/${data.endTime}`, {}, { method: 'GET', responseType: 'blob' })
}

// 更新登记车位状态
export async function updateDefenseParkingRegisterStatus(data) {
  return await axios(`org/update-defense-parking-register-status`, data, { method: 'PUT' })
}

// 下载登记材料
export async function downloadRegisterMaterial(registerId) {
  return await axios(`org/download-register-material/${registerId}`, {}, { method: 'GET', responseType: 'blob' })
}

// 根据id获取材料base64
export async function registerMaterialPreview(id) {
  return await axios(`org/register-material-preview/${id}`, {}, { method: 'GET' })
}

// 获取登记账号信息
export async function parkingRegisterAccountInfo(userAccountId) {
  return await axios(`org/parking-register-account-info/${userAccountId}`, {}, { method: 'GET' })
}

// 获取人防车位事项信息
export async function parkingContractInfo(orderId) {
  return await axios(`org/parking-contract-info/${orderId}`, {}, { method: "get" })
}

// 预览合同图片
export async function notaryPaperPreviewImg(data) {
  return await axios(`org/notary-paper-preview-img`, data, { method: "get" })
}

// 下载登记材料
export async function downLoadNotaryPaper(data) {
  return await axios(`org/downLoad-notary-paper/${data.orderId}/${data.notaryPaperId}`, {}, { method: 'GET', responseType: 'blob' })
}

// 填写公证书编号
export async function modifyParkingContractInfo(data) {
  return await axios(`org/parking-contract-info`, data, { method: 'PUT' })
}

// 获取审核文书列表
export async function orderNotaryList(orderId) {
  return await axios(`org/order-notary-list/${orderId}`, {}, { method: 'GET' })
}

// 合同公证书预览信息
export async function notaryPaperPreview(notaryPaperId) {
  return await axios(`org/notary-paper-preview/${notaryPaperId}`, {}, { method: 'GET' })
}

// 审核合同信息 0未审核  1审核通过  2审核不通过
export async function checkParkingContractInfo(data) {
  return await axios(`org/check-parking-contract-info`, data, { method: 'PUT' })
}

// 获取wps文档打开链接
export async function wpsV1ApiFileGetViewUrlWebPath(data) {
  return await axios(`org/v1/api/file/getViewUrlWebPath?orderId=${data.orderId}&bucketName=${data.bucketName}&fileName=${data.fileName}&notaryPaperId=${data.notaryPaperId}`, data, { method: 'GET' })
}

// 更新云端文档到服务器
export async function wpsTempFile(notaryPaperId) {
  return await axios(`org/wps-temp-file?notaryPaperId=${notaryPaperId}`, {}, { method: 'PUT' })
}

// 获取需要替换的josn数据
export async function getReplaceJson(orderId) {
  return await axios(`org/get-replace-json/${orderId}`, {}, { method: 'GET' })
}

// 替换josn数据
export async function replaceVariable(data) {
  return await axios(`org/replace-variable`, data, { method: 'POST' })
}

// 订单完成保存车位原、现持有人信息 (出具证书)
export async function saveDefenseParkingHolderInfo(orderId) {
  return await axios(`org/save-defense-parking-holder-info/${orderId}`, {}, { method: 'GET' })
}

// 
export async function orderLicense(orderId) {
  return await axios(`org/order-license?orderId=${orderId}`, {}, { method: 'GET' })
}

// 
export async function updateOrderExpressSend(params) {
  return await axios(`org/update-order-express-send`, params, { method: 'POST' })
}
