import type { ApiLoginPayload, ApiRegisterPayload, ApiRegisterResponse, ApiUser } from '@/shared/api/types'

export type AuthSessionResponse = {
  user: ApiUser
}

export type AuthLogoutResponse = {
  success: boolean
}

export const authApi = {
  register: (payload: ApiRegisterPayload) => {
    const requestFetch = useRequestFetch()

    return requestFetch<ApiRegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
  },

  login: (payload: ApiLoginPayload) => {
    const requestFetch = useRequestFetch()

    return requestFetch<AuthSessionResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
  },

  me: () => {
    const requestFetch = useRequestFetch()

    return requestFetch<AuthSessionResponse>('/api/auth/me')
  },

  session: () => {
    const requestFetch = useRequestFetch()

    return requestFetch<AuthSessionResponse>('/api/auth/session')
  },

  refresh: () => {
    const requestFetch = useRequestFetch()

    return requestFetch<AuthSessionResponse>('/api/auth/refresh', {
      method: 'POST',
    })
  },

  logout: () => {
    const requestFetch = useRequestFetch()

    return requestFetch<AuthLogoutResponse>('/api/auth/logout', {
      method: 'POST',
    })
  },
}
