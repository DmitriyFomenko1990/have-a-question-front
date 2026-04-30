import type { ApiLoginPayload, ApiTokenPair, ApiUser } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<{ user: ApiUser }> => {
  const body = await readLoginBody(event)
  const tokens = await requestApi<ApiTokenPair, ApiLoginPayload>('/api/auth/token/', {
    method: 'POST',
    body,
  })

  setAuthTokens(event, tokens)

  const user: ApiUser = await requestApi<ApiUser>('/api/auth/me/', {
    accessToken: tokens.access,
  })

  return {
    user,
  }
})
