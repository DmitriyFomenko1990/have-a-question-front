import type { ApiLoginPayload, ApiRegisterPayload, ApiRegisterResponse, ApiUser } from '@/shared/api/types'

export type AuthSessionResponse = {
  user: ApiUser
}

export type AuthLogoutResponse = {
  success: boolean
}

export const authApi = {
  register: (payload: ApiRegisterPayload) =>
    $fetch<ApiRegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: payload,
    }),

  login: (payload: ApiLoginPayload) =>
    $fetch<AuthSessionResponse>('/api/auth/login', {
      method: 'POST',
      body: payload,
    }),

  me: () => $fetch<AuthSessionResponse>('/api/auth/me'),

  refresh: () =>
    $fetch<AuthSessionResponse>('/api/auth/refresh', {
      method: 'POST',
    }),

  logout: () =>
    $fetch<AuthLogoutResponse>('/api/auth/logout', {
      method: 'POST',
    }),
}
