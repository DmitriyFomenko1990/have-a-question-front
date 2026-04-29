import { defineStore } from 'pinia'
import { authApi } from '@/shared/api/auth/auth.api'
import type { ApiLoginPayload, ApiRegisterPayload, ApiRegisterResponse, ApiUser } from '@/shared/api/types'

type AuthStatus = 'idle' | 'pending' | 'authenticated' | 'anonymous'

type AuthState = {
  user: ApiUser | null
  status: AuthStatus
  error: string | null
}

const getAuthErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return 'Auth request failed'
  }

  if ('statusMessage' in error && typeof error.statusMessage === 'string') {
    return error.statusMessage
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Auth request failed'
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    status: 'idle',
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isPending: (state) => state.status === 'pending',
  },

  actions: {
    async register(payload: ApiRegisterPayload): Promise<ApiRegisterResponse> {
      this.status = 'pending'
      this.error = null

      try {
        const registeredUser = await authApi.register(payload)
        this.status = this.user ? 'authenticated' : 'anonymous'

        return registeredUser
      } catch (error) {
        this.status = this.user ? 'authenticated' : 'anonymous'
        this.error = getAuthErrorMessage(error)

        throw error
      }
    },

    async registerAndLogin(payload: ApiRegisterPayload) {
      await this.register(payload)

      return this.login({
        email: payload.email,
        password: payload.password,
      })
    },

    async login(payload: ApiLoginPayload) {
      this.status = 'pending'
      this.error = null

      try {
        const session = await authApi.login(payload)
        this.user = session.user
        this.status = 'authenticated'

        return session.user
      } catch (error) {
        this.user = null
        this.status = 'anonymous'
        this.error = getAuthErrorMessage(error)

        throw error
      }
    },

    async loadMe() {
      this.status = 'pending'
      this.error = null

      try {
        const session = await authApi.me()
        this.user = session.user
        this.status = 'authenticated'

        return session.user
      } catch (error) {
        this.user = null
        this.status = 'anonymous'
        this.error = getAuthErrorMessage(error)

        return null
      }
    },

    async restoreSession() {
      if (this.user) {
        this.status = 'authenticated'

        return this.user
      }

      this.status = 'pending'
      this.error = null

      try {
        const session = await authApi.session()
        this.user = session.user
        this.status = 'authenticated'

        return session.user
      } catch (error) {
        this.user = null
        this.status = 'anonymous'

        return null
      }
    },

    async refreshSession() {
      this.status = 'pending'
      this.error = null

      try {
        const session = await authApi.refresh()
        this.user = session.user
        this.status = 'authenticated'

        return session.user
      } catch (error) {
        this.user = null
        this.status = 'anonymous'
        this.error = getAuthErrorMessage(error)

        throw error
      }
    },

    async logout() {
      this.status = 'pending'
      this.error = null

      try {
        await authApi.logout()
      } finally {
        this.user = null
        this.status = 'anonymous'
      }
    },

    clearError() {
      this.error = null
    },
  },
})
