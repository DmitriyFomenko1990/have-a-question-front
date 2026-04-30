import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/entities/session/model/auth.store'
import { authApi } from '@/shared/api/auth/auth.api'
import type { ApiUser } from '@/shared/api/types'

vi.mock('@/shared/api/auth/auth.api', () => ({
  authApi: {
    register: vi.fn(),
    login: vi.fn(),
    me: vi.fn(),
    session: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
}))

const user: ApiUser = {
  id: 1,
  email: 'user@example.com',
  username: 'user',
  is_email_verified: true,
  date_joined: '2026-04-30T00:00:00Z',
  created_at: '2026-04-30T00:00:00Z',
  updated_at: '2026-04-30T00:00:00Z',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('authenticates user after successful login', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ user })

    const authStore = useAuthStore()
    const result = await authStore.login({
      email: 'user@example.com',
      password: 'password',
    })

    expect(result).toEqual(user)
    expect(authStore.user).toEqual(user)
    expect(authStore.status).toBe('authenticated')
    expect(authStore.error).toBeNull()
  })

  it('sets safe error after failed login', async () => {
    vi.mocked(authApi.login).mockRejectedValue({ statusCode: 401 })

    const authStore = useAuthStore()

    await expect(authStore.login({
      email: 'user@example.com',
      password: 'wrong',
    })).rejects.toEqual({ statusCode: 401 })

    expect(authStore.user).toBeNull()
    expect(authStore.status).toBe('anonymous')
    expect(authStore.errorMessageKey).toBe('auth.errors.invalidCredentials')
  })

  it('restores existing session without exposing restore errors', async () => {
    vi.mocked(authApi.session).mockRejectedValue({ statusCode: 401 })

    const authStore = useAuthStore()
    const result = await authStore.restoreSession()

    expect(result).toBeNull()
    expect(authStore.user).toBeNull()
    expect(authStore.status).toBe('anonymous')
    expect(authStore.error).toBeNull()
  })

  it('reuses pending restore session request', async () => {
    vi.mocked(authApi.session).mockResolvedValue({ user })

    const authStore = useAuthStore()
    const results = await Promise.all([
      authStore.restoreSession(),
      authStore.restoreSession(),
    ])

    expect(results).toEqual([user, user])
    expect(authApi.session).toHaveBeenCalledTimes(1)
    expect(authStore.user).toEqual(user)
  })

  it('sets expired session error after failed refresh', async () => {
    vi.mocked(authApi.refresh).mockRejectedValue({ statusCode: 401 })

    const authStore = useAuthStore()

    await expect(authStore.refreshSession()).rejects.toEqual({ statusCode: 401 })

    expect(authStore.user).toBeNull()
    expect(authStore.status).toBe('anonymous')
    expect(authStore.errorMessageKey).toBe('auth.errors.sessionExpired')
  })

  it('reuses pending refresh session request', async () => {
    vi.mocked(authApi.refresh).mockResolvedValue({ user })

    const authStore = useAuthStore()
    const results = await Promise.all([
      authStore.refreshSession(),
      authStore.refreshSession(),
    ])

    expect(results).toEqual([user, user])
    expect(authApi.refresh).toHaveBeenCalledTimes(1)
    expect(authStore.user).toEqual(user)
  })

  it('clears user state after logout', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ user })
    vi.mocked(authApi.logout).mockResolvedValue({ success: true })

    const authStore = useAuthStore()
    await authStore.login({
      email: 'user@example.com',
      password: 'password',
    })
    await authStore.logout()

    expect(authStore.user).toBeNull()
    expect(authStore.status).toBe('anonymous')
    expect(authStore.error).toBeNull()
  })
})
