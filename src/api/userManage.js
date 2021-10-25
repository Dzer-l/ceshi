import { axios } from '@/utils/axios'

// 获取列表信息
export async function getUserInfo(data) {
  return await axios(`org/queryUserListByOrgId`, data)
}

// 批量启用禁用
export async function bacthOperate(data) {
  return await axios(`org/batchUpdateUserState`, data)
}

// 重置密码
export async function resetPassword(data) {
  return await axios(`org/resetPassword`, data)
}

// 新增用户
export async function addUser(data) {
  return await axios(`org/insertUser`, data)
}

// 查询所有角色
export async function getRoleList(data) {
  return await axios(`org/queryAllRoleByOrgId`, data)
}

// 编辑账户信息
export async function updateUserInfo(data) {
  return await axios(`org/updateUserInfo`, data)
}

export async function updateUserRole(data) {
  return await axios(`org/updateUserRoleRe`, data)
}

export async function deleteUser(data) {
  return await axios(`org/deleteUser`, data)
}
