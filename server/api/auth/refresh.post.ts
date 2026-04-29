import type { ApiUser } from '@/shared/api/types'

export default defineEventHandler(async (event): Promise<{ user: ApiUser }> => {
  await refreshAuthSession(event)
  const user: ApiUser = await requestCurrentUser(event)

  return {
    user,
  }
})
