import { axios } from '@/utils/axios'

// 地址簿列表
export async function getAddressBookList(data) {
  return await axios(`org/express-address-page`, data, { method: 'post' })
}

// 新增地址簿
export async function addExpressAddress(data) {
  return await axios(`org/add-express-address`, data, { method: 'post' })
}

// 修改地址簿
export async function updateExpressAddress(data) {
  return await axios(`org/update-express-address`, data, { method: 'post' })
}

// 删除地址簿
export async function deleteExpressAddress(params) {
  return await axios(`org/express-address/${params}`, {}, { method: 'get' })
}

// 获取单个地址详情
export async function getAddressDetail(params) {
  return await axios(`org/express-address-detail/${params}`, {}, { method: 'get' })
}

// 城市三级联动数据
export async function getCityRegionTree() {
  return await axios(`org/region-tree`, {}, { method: 'get' })
}

// 城市三级联动数据
export async function getCityParents(data) {
  return await axios(`org/region`, data, { method: 'get' })
}
