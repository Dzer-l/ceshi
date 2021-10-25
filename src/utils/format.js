import axios from 'axios'
import cfg from '@/utils/config'

export function changeToken(param) { // 刷新token 注意这里用到的service
  const params = {
    client_id: 'org',
    client_secret: 'org',
    grant_type: 'refresh_token',
    scope: 'org',
    refresh_token: param.refresh_token
  }
  return axios.post(cfg.http + '/uaa/oauth/token', params)
    .then((res) => {
      return Promise.resolve(res.data)
    })
}
