import Cookies from 'js-cookie'

const AccessTokenKey = 'Access-Token'
const RefreshTokenKey = 'Refresh-Token'

export function getAccessToken() {
  return Cookies.get(AccessTokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setAccessToken(token) {
  return Cookies.set(AccessTokenKey, token)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeAccessToken() {
  return Cookies.remove(AccessTokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}
