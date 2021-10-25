import { axios } from '@/utils/axios';

// 线上邮寄公证书列表
export async function getOnlineMailList(data) {
	return await axios(`org/express-send-certificate-page`, data, { method: "post" })
}

// 线上邮寄公证书查询详情
export async function getOnlineMailListDetail(params) {
	return await axios(`org/express-send-certificate/${params}`, {}, { method: "get" })
}

// 获取申请人及受让人信息详情
export async function orderProposeByOrderNum(orderNum) {
	return await axios(`org/order-propose-by-order-num/${orderNum}`, {}, { method: "get" })
}

// 线上邮寄公证书取消订单
export async function getOnlineCancelOrder(data) {
	return await axios(`org/express-send-cancel`, data, { method: "get" })
}

// 线下邮寄公证书列表
export async function getOfflineMailList(data) {
	return await axios(`org/express-receive-certificate-page`, data, { method: "post" })
}

// 获取收件人地址列表
export async function getReceiverAddressList(params) {
	return await axios(`org/express-send-certificate-detail?ids=${params}`, {}, { method: "get" })
}

// 修改收件人地址
export async function updateExpressReceiverAddress(data) {
	return await axios(`org/update-expressSenderReceiver-by-Id`, data, { method: "post" })
}

// 获取寄件/收件记录列表
export async function getPackageRecord(data) {
	return await axios(`org/package-record-page`, data, { method: "post" })
}

// 获取寄件/收件记录详情
export async function getPackageRecordDetail(params) {
	return await axios(`org/package-record-detail/${params}`, {}, { method: "get" })
}

// 取消寄件
export async function getPackageRecordCancel(params) {
	return await axios(`org/package-cancel/${params}`, {}, { method: "get" })
}

// 根据当前用户的公证处id查询业务类型
export async function getOrgProductionList(params) {
	return await axios(`org/org-production-list`, {}, { method: "get" })
}

// 获取当前公证处的办证点
export async function getOrgOfficeList(params) {
	return await axios(`org/org-office-by-orgId`, {}, { method: "get" })
}

// 导出寄件/收件记录列表
export async function exportPackageRecordExcel(data) {
	return await axios(`org/package-record-excel`, data, { method: 'POST', responseType: 'blob' })
}

// 呼叫快递
export async function callExpress(data) {
	return await axios(`org/package-send`, data, { method: 'POST' })
}

// 获取打印面单列表
export async function getExpressPrintList(data) {
	return await axios(`org/package-send-success`, data, { method: 'POST' })
}

// 获取打印信息
export async function packagePrint(params) {
	return await axios(`org/package-print/${params}`, {}, { method: "get" })
}

// 获取打印信息
export async function getDeafultSenderAddress(params) {
	return await axios(`org/org-user-address`, {}, { method: "get" })
}

export async function getOrderByOrderNumOrderNum(params) {
	return await axios(`org/get-order-by-orderNum?orderNum=${params}`, {}, { method: "get" })
}

// 线下邮寄公证书列表--新
export async function getOfflineLicenseList(data) {
	return await axios(`org/get-offline-license-list`, data, { method: "get" })
}

// 预约线下领证信息
export async function appointmentTime(data) {
	return await axios(`org/appointment-time`, data, { method: "put" })
}

// 线下领取公证书详情
export async function getOrderOfflineReceiveDetail(data) {
	return await axios(`org/get-order-offline-receive-detail`, data, { method: "get" })
}
