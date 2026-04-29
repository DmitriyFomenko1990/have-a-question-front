import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'

type ApiMethod = 'GET' | 'POST'

type ApiRequestOptions<TBody> = {
  method?: ApiMethod
  body?: TBody
  accessToken?: string | null
}

export const requestApi = async <TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> => {
  const config = useRuntimeConfig()
  const headers = new Headers()

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }

  return $fetch<TResponse>(path, {
    baseURL: config.apiBaseUrl,
    method: options.method || 'GET',
    body: options.body as FetchOptions['body'],
    headers,
  })
}

export const getApiErrorStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return null
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  if ('response' in error) {
    const response = error.response

    if (response && typeof response === 'object' && 'status' in response && typeof response.status === 'number') {
      return response.status
    }
  }

  return null
}
