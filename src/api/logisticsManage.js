import { axios } from '@/utils/axios';

// 获取寄件/收件记录列表
export async function packageRecordList(data) {
	return await axios(`org/package-record-page`, data, { method: "post" })
}

// 获取寄件/件记录详情
export async function packageRecordDetail(params) {
	return await axios(`org/package-record-detail/${params}`, {}, { method: "get" })
}

export async function packagePrint(params) {
	return await axios(`org/package-print/${params}`, {}, { method: "get" })
}

export async function packagePrint2(params) {
	return await axios(`org/package-print2/${params}`, {}, { method: "get" })
}

// 获取操作人
export async function getOperator() {
	return await axios(`org/org-user-list`, {}, { method: "get" })
}

// 获取操作人
export async function refreshExpress(data) {
	return await axios(`org/refresh-express-info`, data, { method: "get" })
}