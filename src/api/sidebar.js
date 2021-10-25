import { axios } from '@/utils/axios'

export async function getSidebar(params) {
  return await axios(`org/user-menus`, params)
}
