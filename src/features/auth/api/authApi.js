import { get, post } from '../../../helpers/apiHelper'

export const loginApi = async (email, password) => {
  return post(
    '/auth/login',
    new URLSearchParams({ email, password }),
  )
}

export const registerApi = async ({
  name,
  email,
  password,
}) => {
  return post('/auth/register', {
    name,
    email,
    password,
  })
}

export const getMeApi = async () => {
  return get('/auth/me')
}

export const logoutApi = async () => {
  return post('/auth/logout')
}