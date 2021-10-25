import { axios } from '@/utils/axios'

// 订单列表
export async function getUniversalListData(params) {
	return await axios('org/acceptance-order-list', params, { method: 'POST' })
}

// 订单详情
export async function getUniversalOrderDetail(params) {
	return await axios(`org/order/${params.orderId}`, {})
}

// 当事人信息
export async function getUniversalOrderLitigant(params) {
	return await axios(`org/order-propose/${params.orderId}`, {})
}

// 当事人信息查看
export async function getUniversalLitigantDetail(params) {
	return await axios(`org/order-propose-detail/${params.orderProposeId}`, {})
}

// 证据材料查询
export async function getUniversalMaterialList(params) {
	return await axios(`org/acceptance-order-material-list/${params.orderId}`, {})
}

// 文书材料查询
export async function getUniversalDocument(params) {
	return await axios(`org/acceptance-order-document-list?orderId=${params.orderId}`, {})
}

// 文书材料预览
export async function getUniversalDocumentPreview(params) {
	return await axios(`org/acceptance-order-document-preview/${params.orderDocumentId}`, {})
}

// 文书材料预览
export async function getUniversalDocumentPreviewId(data) {
	return await axios(`org/acceptance-order-document-preview/${data.id}`, {})
}

// 文书材料预览图片
export async function getUniversalDocumentPreviewImg(params) {
	return await axios('org/acceptance-order-material-preview-img', params)
}

// 文书下载 
export async function getUniversalDownloadMaterial(params) {
	return await axios(`org/acceptance-download-material`, {})
}

// 完成受理订单
export async function finishUniversalOrder(params) {
	return await axios(`/org/finish-acceptance-order-info`, params, { method: 'POST' })
}

// 获取操作人
export async function getOperator() {
	return await axios(`org/org-user-list`, {}, { method: "get" })
}

// 获取当前公证处的办证点
export async function getOrgOfficeList(params) {
	return await axios(`org/org-office-by-orgId`, {}, { method: "get" })
}

// 导出订单
export async function exportPackageRecordExcel(data) {
	return await axios(`org/download-acceptance-order-excel `, data, { method: 'POST', responseType: 'blob' })
}

// 删除文书材料
export async function DeleteWritMaterials(params) {
	return await axios(`org/order-document/${params.id}`, {}, { method: 'DELETE' })
}