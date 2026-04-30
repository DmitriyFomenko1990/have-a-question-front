import { beforeEach, describe, expect, it, vi } from 'vitest'
import { refreshAuthSession, restoreAuthSession } from './session'
import type { H3Event } from 'h3'
import type { ApiUser } from '@/shared/api/types'

const user: ApiUser = {
  id: 1,
  email: 'user@example.com',
  username: 'user',
  is_email_verified: true,
  date_joined: '2026-04-30T00:00:00Z',
  created_at: '2026-04-30T00:00:00Z',
  updated_at: '2026-04-30T00:00:00Z',
}

const event = {} as H3Event
const requestApi = vi.fn()
const getAuthAccessToken = vi.fn()
const getAuthRefreshToken = vi.fn()
const setAuthTokens = vi.fn()
const clearAuthTokens = vi.fn()

describe('server auth session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('requestApi', requestApi)
    vi.stubGlobal('getAuthAccessToken', getAuthAccessToken)
    vi.stubGlobal('getAuthRefreshToken', getAuthRefreshToken)
    vi.stubGlobal('setAuthTokens', setAuthTokens)
    vi.stubGlobal('clearAuthTokens', clearAuthTokens)
    vi.stubGlobal('getApiErrorStatus', (error: { statusCode?: number }) => error.statusCode ?? null)
    vi.stubGlobal('createError', (input: { statusCode: number, statusMessage: string }) => input)
  })

  it('clears cookies when refresh token is missing', async () => {
    getAuthRefreshToken.mockReturnValue(undefined)

    await expect(refreshAuthSession(event)).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })

    expect(clearAuthTokens).toHaveBeenCalledWith(event)
    expect(requestApi).not.toHaveBeenCalled()
  })

  it('returns current user when access token is valid', async () => {
    getAuthAccessToken.mockReturnValue('access')
    requestApi.mockResolvedValue(user)

    await expect(restoreAuthSession(event)).resolves.toEqual(user)

    expect(requestApi).toHaveBeenCalledWith('/api/auth/me/', {
      accessToken: 'access',
    })
    expect(getAuthRefreshToken).not.toHaveBeenCalled()
  })

  it('refreshes access token when current user request is unauthorized', async () => {
    getAuthAccessToken.mockReturnValue('expired-access')
    getAuthRefreshToken.mockReturnValue('refresh')
    requestApi
      .mockRejectedValueOnce({ statusCode: 401 })
      .mockResolvedValueOnce({ access: 'new-access' })
      .mockResolvedValueOnce(user)

    await expect(restoreAuthSession(event)).resolves.toEqual(user)

    expect(setAuthTokens).toHaveBeenCalledWith(event, {
      access: 'new-access',
    })
    expect(requestApi).toHaveBeenLastCalledWith('/api/auth/me/', {
      accessToken: 'new-access',
    })
  })

  it('clears cookies when refresh token is unauthorized', async () => {
    getAuthAccessToken.mockReturnValue('expired-access')
    getAuthRefreshToken.mockReturnValue('refresh')
    requestApi
      .mockRejectedValueOnce({ statusCode: 401 })
      .mockRejectedValueOnce({ statusCode: 401 })

    await expect(restoreAuthSession(event)).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })

    expect(clearAuthTokens).toHaveBeenCalledWith(event)
  })
})
