import { axios } from '@/utils/axios'

// 获取公证产品列表
export async function getProductList(params) {
  return await axios('org/listOrgProduction', params, { method: 'post' })
}

// 获取材料库列表
export async function getMaterialList(params) {
  return await axios('org/org-materials', params, { method: 'post' })
}

// 新增材料
export async function addMaterial(params) {
  return await axios('org/insertOrgMaterial', params, { method: 'post' })
}

// 修改材料
export async function editMaterial(params) {
  return await axios('org/updateOrgMaterial', params, { method: 'post' })
}

// 获取委托人材料
export async function getClientList(params) {
  return await axios('org/getProductionMaterialUserRole', params, { method: 'post' })
}

// 根据材料id查询材料列表
export async function getMaterialRe(params) {
  return await axios('org/selectProductionUserMaterial', params, { method: 'post' })
}

// 添加用户材料(所有材料)查询
export async function selectCertTypeRe(params) {
  return await axios('org/selectCertTypeRe', params, { method: 'post' })
}

// 添加事项材料(所有材料)查询
export async function selectMaterialRe(params) {
  return await axios('org/selectMaterialRe', params, { method: 'post' })
}

// 事项材料列表查询
export async function selectProductionMaterial(params) {
  return await axios('org/selectProductionMaterial', params, { method: 'post' })
}

// 添加已有用户材料
export async function addRoleMaterial(params) {
  return await axios('org/insertRoleCertTypeMaterial', params, { method: 'post' })
}

// 添加机构事项材料
export async function addOrgNotaryMaterial(params) {
  return await axios('org/insertOrgNotaryMaterial', params, { method: 'post' })
}

// 删除用户材料
export async function deleteUserMaterial(params) {
  return await axios('org/deleteProductionUserRoleMaterialRe', params, { method: 'post' })
}

// 删除事项材料
export async function deleteItemMaterial(params) {
  return await axios('org/deleteOrgProductionMaterialRe', params, { method: 'post' })
}

// 根据id查询产品信息
export async function getProductInfo(params) {
  return await axios('org/selectById', params, { method: 'post' })
}

// 根据id修改产品信息
export async function updateProductInfo(params) {
  return await axios('org/updateOrgProductionCost', params, { method: 'post' })
}

// 启用产品时回显
export async function getSelectedProductInfo(params) {
  return await axios('org/openShowInfo', params, { method: 'post' })
}

// 公证处禁用产品
export async function disableProduct(params) {
  return await axios('org/orgCloseProduction', params, { method: 'post' })
}

// 公证处开启产品
export async function enableProduct(params) {
  return await axios('org/orgOpenProduction', params, { method: 'post' })
}

// 公证处开启产品
export async function getCategoryType() {
  return await axios('org/selectAllConfigNotaryCategory', {}, { method: 'post' })
}

// 修改产品说明
export async function updateProductDes(params) {
  return await axios('org/updateProductionDescById', params, { method: 'post' })
}

// 产品排序接口
export async function productionSortOrder(params) {
  return await axios('org/productionSortOrder', params, { method: 'post' })
}

// 材料排序接口
export async function sortMaterial(params) {
  return await axios('org/materialSortOrder', params, { method: 'post' })
}
//获取分配权限用户的分页数据
export async function gainAllocationPrivilegeUser(params) {
  return await axios('org/user-by-production-id-page-info', params, {method: 'get' })
}
//获取用户列表
export async function gainUserList(params) {
  return await axios('org/get-user-by-production-id', params, {method: 'get' })
}
//添加产品用户production-user
export async function addProductionUser(params) {
  return await axios('org/org-production-user-re', params, {method: 'POST' })
}
//删除产品用户
export async function deleteProductionUser(params){
  return await axios(`org/production-user-re/${params.productionId}/${params.orgUserId}`,{}, {method: 'delete' })
}
