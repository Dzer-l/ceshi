import { axios } from '@/utils/axios'
import { base64 } from '@/utils/index'
import qs from 'qs'

export async function login(data) {
  return await axios('auth/oauth/token', qs.stringify(data), {
    method: 'post',
    headers: {
      'Authorization': `Basic ${base64('org:org')}`,
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export async function getRouter(token) {
  return await axios('/org/user-menus')
}

export async function logout() {
  return await axios(`auth/token/logout`, {}, { method: 'delete' })
}
