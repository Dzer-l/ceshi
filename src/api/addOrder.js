import { axios } from '@/utils/axios'

// 获取事项热门产品
export async function orgHotNotaryTopList(orgId) {
	return await axios(`org/org-hot-notary-top-list?orgId=${orgId}`, {}, { method: 'GET' })
}

// 获取事项所有产品
export async function orgNotaryFirstCharacterMaps(orgId) {
	return await axios(`org/orgNotaryFirstCharacterMap?orgId=${orgId}`, {}, { method: 'GET' })
}

// 证件类型列表
export async function certificateType(data) {
	return await axios(`org/certificate-type?prodCode=${data.prodCode}`, {}, { method: 'GET' })
}

// 需要上传的文件
export async function productionRoleCertMaterial(data) {
	return await axios(`org/org-production-role-cert-material?orgProductionRoleCertId=${data.orgProductionRoleCertId}`, {}, { method: 'GET' })
}

// 获取文件加密密钥
// export async function getAesKey() {
// 	return await axios(`org/get-aes-key`, {}, { method: 'GET' })
// }

// 身份证ocr
export async function ocrIdCard(data) {
	return await axios(`org/ocr-id-card`, data, { method: 'POST' })
}

// 单个文件上传
export async function singleFileUploadRemote(data) {
	return await axios(`org/single-file-upload-remote`, data, { method: 'POST' })
}

// 新增订单
export async function remoteVideoAcceptanceOrderSubmit(data) {
	return await axios(`org/remote-video-acceptance-order-submit`, data, { method: 'POST' })
}
