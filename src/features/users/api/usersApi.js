import { get } from '../../../helpers/apiHelper'

export const getUsersApi = async (queryParams = {}) => {
  return get('/users', queryParams)
}

export const getUserByIdApi = async (userId) => {
  return get(`/users/${userId}`)
}