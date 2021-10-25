import { axios } from '@/utils/axios'

export async function getNotary(data) {
  return await axios(`org/queryOrgMenuByOrgId`, data, { method: 'post' })
}
