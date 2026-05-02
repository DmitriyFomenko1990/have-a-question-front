import type { ApiQuestionListItem } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<ApiQuestionListItem[]> => {
  const accessToken = getAuthAccessToken(event)

  if (!accessToken) {
    throw createUnauthorizedError()
  }

  try {
    return await requestApi<ApiQuestionListItem[]>('/api/questions/', {
      accessToken,
    })
  } catch (error) {
    if (getApiErrorStatus(error) !== 401) {
      throw error
    }

    const refreshedAccessToken = await refreshAuthSession(event)

    return requestApi<ApiQuestionListItem[]>('/api/questions/', {
      accessToken: refreshedAccessToken,
    })
  }
})
