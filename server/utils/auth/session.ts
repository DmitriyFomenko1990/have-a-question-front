import type { H3Event } from 'h3'
import type { ApiTokenRefresh, ApiTokenRefreshPayload, ApiUser } from '@/shared/api/types'

const createUnauthorizedError = () =>
  createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  })

export const refreshAuthSession = async (event: H3Event): Promise<string> => {
  const refresh = getAuthRefreshToken(event)

  if (!refresh) {
    throw createUnauthorizedError()
  }

  const token = await requestApi<ApiTokenRefresh, ApiTokenRefreshPayload>('/api/auth/token/refresh/', {
    method: 'POST',
    body: { refresh },
  })

  setAuthTokens(event, {
    access: token.access,
  })

  return token.access
}

export const requestCurrentUser = async (event: H3Event): Promise<ApiUser> => {
  const access = getAuthAccessToken(event)

  if (!access) {
    throw createUnauthorizedError()
  }

  return requestApi<ApiUser>('/api/auth/me/', {
    accessToken: access,
  })
}

export const restoreAuthSession = async (event: H3Event): Promise<ApiUser> => {
  try {
    return await requestCurrentUser(event)
  } catch (error) {
    if (getApiErrorStatus(error) !== 401) {
      throw error
    }
  }

  try {
    const refreshedAccess = await refreshAuthSession(event)

    return await requestApi<ApiUser>('/api/auth/me/', {
      accessToken: refreshedAccess,
    })
  } catch (error) {
    clearAuthTokens(event)

    if (getApiErrorStatus(error) === 401) {
      throw createUnauthorizedError()
    }

    throw error
  }
}
