const API_BASE_URL =
  typeof DELCOM_BASEURL === 'undefined'
    ? 'https://open-api.delcom.org/api/v1'
    : DELCOM_BASEURL

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const putAccessToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

const buildUrl = (path, queryParams = {}) => {
  const url = new URL(`${API_BASE_URL}${path}`)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value)
    }
  })

  return url.toString()
}

const buildBody = (body, isRawBody) => {
  if (isRawBody) {
    return body
  }

  if (body) {
    return JSON.stringify(body)
  }

  return undefined
}

const request = async (
  method,
  path,
  body = null,
  queryParams = {},
  options = {},
) => {
  const token = getAccessToken()

  const headers = {
    Accept: 'application/json',
    ...options.headers,
  }

  const isRawBody =
    body instanceof FormData ||
    body instanceof URLSearchParams

  if (!isRawBody) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    buildUrl(path, queryParams),
    {
      method,
      headers,
      body: buildBody(body, isRawBody),
      ...options,
    },
  )

  let data = null

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data?.message
        ? data.message
        : `Request failed with status ${response.status}`

    throw new Error(message)
  }

  return data
}

export const get = (path, queryParams = {}, options = {}) => {
  return request(
    'GET',
    path,
    null,
    queryParams,
    options,
  )
}

export const post = (
  path,
  body = null,
  queryParams = {},
  options = {},
) => {
  return request(
    'POST',
    path,
    body,
    queryParams,
    options,
  )
}

export const put = (
  path,
  body = null,
  queryParams = {},
  options = {},
) => {
  return request(
    'PUT',
    path,
    body,
    queryParams,
    options,
  )
}

export const del = (
  path,
  body = null,
  queryParams = {},
) => {
  return request(
    'DELETE',
    path,
    body,
    queryParams,
    options,
  )
}