
export function getToken() {
  return sessionStorage.getItem('access_token')
  // return Cookies.get(TokenKey)
}

export function getResetTime() {
  return sessionStorage.getItem('reset_time')
}

export function getRefreshToken() {
  return sessionStorage.getItem('refresh_token')
}
 
export function setToken(data) {
  sessionStorage.setItem('access_token', data.access_token)
  sessionStorage.setItem('user_id', data.user_id)
  const time = new Date()
  sessionStorage.setItem('reset_time', time)
  sessionStorage.setItem('click_time', time)
  sessionStorage.setItem('org_id', data.org_id)
  sessionStorage.setItem('refresh_token', data.refresh_token)
}

export function removeToken() {
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('click_time')
  sessionStorage.removeItem('reset_time')
  sessionStorage.removeItem('org_id')
  sessionStorage.removeItem('user_id')
  sessionStorage.removeItem('refresh_token')
  sessionStorage.removeItem('savePath')
}
