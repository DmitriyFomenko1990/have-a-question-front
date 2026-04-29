import type { H3Event } from 'h3'
import type { ApiTokenRefresh, ApiTokenRefreshPayload, ApiUser } from '@/shared/api/types'

export const refreshAuthSession = async (event: H3Event): Promise<string> => {
  const refresh = getAuthRefreshToken(event)

  if (!refresh) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
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
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  try {
    return await requestApi<ApiUser>('/api/auth/me/', {
      accessToken: access,
    })
  } catch (error) {
    if (getApiErrorStatus(error) !== 401) {
      throw error
    }

    const refreshedAccess = await refreshAuthSession(event)

    return requestApi<ApiUser>('/api/auth/me/', {
      accessToken: refreshedAccess,
    })
  }
}
