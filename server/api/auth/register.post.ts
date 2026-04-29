import type { ApiRegisterPayload, ApiRegisterResponse } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<ApiRegisterResponse> => {
  const body = await readBody<ApiRegisterPayload>(event)

  return requestApi<ApiRegisterResponse, ApiRegisterPayload>('/api/auth/register/', {
    method: 'POST',
    body,
  })
})
