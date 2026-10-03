import {
  del,
  get,
  post,
  put,
} from '../../../helpers/apiHelper'

export const getLostFoundsApi = async (queryParams = {}) => {
  return get('/lost-founds', queryParams)
}

export const getLostFoundByIdApi = async (id) => {
  return get(`/lost-founds/${id}`)
}

export const addLostFoundApi = async (data) => {
  return post('/lost-founds', data)
}

export const updateLostFoundApi = async (id, data) => {
  return put(`/lost-founds/${id}`, data)
}

export const uploadLostFoundCoverApi = async (id, formData) => {
  return post(`/lost-founds/${id}/cover`, formData)
}

export const deleteLostFoundApi = async (id) => {
  return del(`/lost-founds/${id}`)
}

export const getLostFoundStatsDailyApi = async (
  queryParams = {},
) => {
  return get('/lost-founds/stats/daily', queryParams)
}

export const getLostFoundStatsMonthlyApi = async (
  queryParams = {},
) => {
  return get('/lost-founds/stats/monthly', queryParams)
}