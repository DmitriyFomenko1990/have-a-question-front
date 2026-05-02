import type { ApiQuestionRespondPayload, ApiQuestionRespondResponse } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<ApiQuestionRespondResponse> => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<ApiQuestionRespondPayload>(event)
  const accessToken = getAuthAccessToken(event)

  if (!id || !accessToken) {
    throw createUnauthorizedError()
  }

  try {
    return await requestApi<ApiQuestionRespondResponse, ApiQuestionRespondPayload>(`/api/questions/${id}/respond/`, {
      method: 'POST',
      body,
      accessToken,
    })
  } catch (error) {
    if (getApiErrorStatus(error) !== 401) {
      throw error
    }

    const refreshedAccessToken = await refreshAuthSession(event)

    return requestApi<ApiQuestionRespondResponse, ApiQuestionRespondPayload>(`/api/questions/${id}/respond/`, {
      method: 'POST',
      body,
      accessToken: refreshedAccessToken,
    })
  }
})
