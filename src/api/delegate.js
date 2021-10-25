import { axios } from '@/utils/axios'

// 修改卷宗号
export async function getDossierNum(params) {
  return await axios('org/update-order-dossier-num', params, { method: 'put' })
}

// 获取订单详情
export async function getInfo(params) {
  return await axios('org/house-property-order-detail', params)
}

// 获取签署文件列表
export async function getSignList(params) {
  return await axios('org/order-document-list', params)
}

// 获取委托人信息
export async function getEntrustInfo(params) {
  return await axios('org/house-property-order', params)
}

// JSON串获取图片
export async function getImg(params) {
  return await axios('org/watch-img' + params, {}, { responseType: 'arraybuffer' })
}

// 获取邮寄信息
export async function getShippingInfo(params) {
  return await axios('org/order-shipping-list', params)
}

// 获取文书
export async function getFileImg(data) {
  return await axios(`org/order-document-preview/${data.id}`)
}

// 删除文书
export async function delSignFile(data) {
  return await axios(`org/order-document/${data.id}`, {}, { method: 'DELETE' })
}

// 获取签名区域
export async function getSignDiv(params) {
  return await axios('org/order-proposer-document-sig-region', params)
}

// 提交签名区域
export async function submitSignDiv(params) {
  return await axios('org/order-proposer-document-sig-region', params, { method: 'post' })
}

// 查询公证员手机号
export async function getNotrayTel(params) {
  return await axios('org/select-order-notary-user-mobile', params)
}

export async function setNotrayTel(params) {
  return await axios('org/insert-order-notary-user-mobile', params, { method: 'post' })
}

// 获取视频参数
export async function getVideoData(params) {
  return await axios('org/tencent-live-args', params)
}

// 开始录制视频
export async function startVideo(params) {
  return await axios(`org/start-record-video/${params}`)
}

// 挂断视频
export async function endVideo(params) {
  return await axios(`org/stop-record-video/${params}`)
}

// 获取二维码

export async function getQR(params) {
  return await axios(`org/QRCode/${params}`)
}

export async function judgeWho(params) {
  return await axios(`org/user-type-sign/${params}`)
}
