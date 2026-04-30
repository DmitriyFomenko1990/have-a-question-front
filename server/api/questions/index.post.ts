import type { ApiQuestionCreatePayload, ApiQuestionCreateResponse } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<ApiQuestionCreateResponse> => {
  const body = await readBody<ApiQuestionCreatePayload>(event)
  const accessToken = getAuthAccessToken(event)

  if (!accessToken) {
    throw createUnauthorizedError()
  }

  try {
    return await requestApi<ApiQuestionCreateResponse, ApiQuestionCreatePayload>('/api/questions/', {
      method: 'POST',
      body,
      accessToken,
    })
  } catch (error) {
    if (getApiErrorStatus(error) !== 401) {
      throw error
    }

    const refreshedAccessToken = await refreshAuthSession(event)

    return requestApi<ApiQuestionCreateResponse, ApiQuestionCreatePayload>('/api/questions/', {
      method: 'POST',
      body,
      accessToken: refreshedAccessToken,
    })
  }
})
