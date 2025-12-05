import http from '../utils/http'
import type { ILogin, ISignup } from '../interfaces/auth'
export const login = (payload : ILogin) => {
  return http.post('/auth/signin', payload)
}

export const register = (payload : ISignup) => {
  return http.post('/auth/signup', payload)
}

export const logout = () => {
  return http.post('/auth/logout')
}