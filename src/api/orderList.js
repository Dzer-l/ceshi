import { axios } from '@/utils/axios'

// 获取订单列表
export async function getProxyOrderList(data) {
	return await axios(`org/get-proxy-order-list/${data.pageNum}/${data.pageSize}`, {}, { method: 'GET' })
}