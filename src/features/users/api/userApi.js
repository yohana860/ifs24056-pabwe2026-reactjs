import {
  get,
  post,
  put,
} from '../../../helpers/apiHelper'

export const getUserProfileApi = async () => {
  return get('/users/me')
}

export const updateUserProfileApi = async (data) => {
  return put('/users/me', data)
}

export const uploadUserPhotoApi = async (formData) => {
  return post('/users/me/photo', formData)
}

export const updateUserPasswordApi = async (data) => {
  return put('/users/me/password', data)
}