import { axios } from '@/utils/axios'

// 查询全部角色列表
export async function getRoleInfo(data) {
  return await axios(`org/sys-roles-orgId/${data.pageNum}/${data.pageSize}`)
}

// 根据id获取角色详细信息
export async function getRoleDetail(id) {
  return await axios(`org/sys-role/${id}`)
}

export async function updateRoleInfo(data) {
  return await axios(`org/sys-role/${data.id}`, {
    roleName: data.roleName,
    roleDescription: data.roleDescription
  }, { method: 'post' })
}

// 删除单行数据
export async function deleteRole(data) {
  return await axios(`org/sys-role/${data.roleId}`, {}, { method: 'delete' })
}
// 批量删除数据
export async function batchDelete(params) {
  // eslint-disable-next-line no-undef
  return await axios(`org/sys-role/${data.roleId}`, params, { method: 'delete' })
}

// 条件查询角色信息
export async function searchRole(data) {
  return await axios(`org/sys-roles/sysRoleName`, data)
}
// 获取权限列表(新增)
export async function getAddRoleMenuList() {
  return await axios(`org/user-menus-orgId`)
}
// 获取权限列表(编辑)
export async function getRoleMenuList(id) {
  return await axios(`org/sys-role-menu-res/${id}`)
}
// 新增角色
export async function addRole(data) {
  return await axios(`org/sys-role-insert`, data)
}
