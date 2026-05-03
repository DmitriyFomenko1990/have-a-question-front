import type { ApiQuestionSearchPayload, ApiQuestionSearchResponse } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<ApiQuestionSearchResponse> => {
  const body = await readBody<ApiQuestionSearchPayload>(event)
  const accessToken = getAuthAccessToken(event)

  if (!accessToken) {
    throw createUnauthorizedError()
  }

  try {
    return await requestApi<ApiQuestionSearchResponse, ApiQuestionSearchPayload>('/api/questions/search/', {
      method: 'POST',
      body,
      accessToken,
    })
  } catch (error) {
    if (getApiErrorStatus(error) !== 401) {
      throw error
    }

    const refreshedAccessToken = await refreshAuthSession(event)

    return requestApi<ApiQuestionSearchResponse, ApiQuestionSearchPayload>('/api/questions/search/', {
      method: 'POST',
      body,
      accessToken: refreshedAccessToken,
    })
  }
})
