   const API_BASE_URL =
     typeof DELCOM_BASEURL !== 'undefined'
       ? DELCOM_BASEURL
       : 'https://open-api.delcom.org/api/v1'

export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export const putAccessToken = (token) => {
  if (token) {
    localStorage.setItem('access_token', token)
  } else {
    localStorage.removeItem('access_token')
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

  if (!(body instanceof FormData)) {
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
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
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
  options = {},
) => {
  return request(
    'DELETE',
    path,
    body,
    queryParams,
    options,
  )
}