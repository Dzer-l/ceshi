import { axios } from '@/utils/axios'

// 获取列表信息
export async function getUserInfo(data) {
  return await axios(`org/queryUserInfoByUserId`, data)
  // return request({
  //   url: '/org/queryUserInfoByUserId',
  //   method: 'post',
  //   params: data
  // })
}

// 修改登录用户密码
export async function updatePassword(data) {
  return await axios(`org/updateLoginUserPassword`, data)
  // return request({
  //   url: '/org/updateLoginUserPassword',
  //   method: 'post',
  //   params: data
  // })
}

// 获取办证地点
export async function queryOrgOffices(data) {
  return await axios(`org/queryOrgOffices`, data)
  // return request({
  //   url: '/org/queryOrgOffices',
  //   method: 'post',
  //   params: data
  // })
}

// 保存办证地点
export async function updateOrgOffice(data) {
  return await axios(`org/updateLoginUserOrgOffice`, data)
  // return request({
  //   url: '/org/updateLoginUserOrgOffice',
  //   method: 'post',
  //   params: data
  // })
}

// 获取用户左侧菜单权限
export async function getUserMenu() {
  return await axios(`org/user-menus`)
}
