import { defineStore } from 'pinia'
import { normalizeAuthError, type AuthError, type AuthErrorContext } from '@/entities/session/model/auth.errors'
import { authApi } from '@/shared/api/auth/auth.api'
import type { ApiLoginPayload, ApiRegisterPayload, ApiRegisterResponse, ApiUser } from '@/shared/api/types'

type AuthStatus = 'idle' | 'pending' | 'authenticated' | 'anonymous'

type AuthState = {
  user: ApiUser | null
  status: AuthStatus
  error: AuthError | null
}

const restoreSessionRequests = new WeakMap<object, Promise<ApiUser | null>>()
const refreshSessionRequests = new WeakMap<object, Promise<ApiUser>>()

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    status: 'idle',
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isPending: (state) => state.status === 'pending',
    errorMessageKey: (state) => state.error?.messageKey ?? null,
  },

  actions: {
    startRequest() {
      this.status = 'pending'
      this.error = null
    },

    setAuthenticated(user: ApiUser) {
      this.user = user
      this.status = 'authenticated'
      this.error = null
    },

    setAnonymous(error: AuthError | null = null) {
      this.user = null
      this.status = 'anonymous'
      this.error = error
    },

    settleWithoutSessionChange(error: AuthError | null = null) {
      this.status = this.user ? 'authenticated' : 'anonymous'
      this.error = error
    },

    setAuthError(error: unknown, context: AuthErrorContext) {
      this.error = normalizeAuthError(error, context)
    },

    async register(payload: ApiRegisterPayload): Promise<ApiRegisterResponse> {
      this.startRequest()

      try {
        const registeredUser = await authApi.register(payload)
        this.settleWithoutSessionChange()

        return registeredUser
      } catch (error) {
        this.settleWithoutSessionChange(normalizeAuthError(error, 'register'))

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
      this.startRequest()

      try {
        const session = await authApi.login(payload)
        this.setAuthenticated(session.user)

        return session.user
      } catch (error) {
        this.setAnonymous(normalizeAuthError(error, 'login'))

        throw error
      }
    },

    async loadMe() {
      this.startRequest()

      try {
        const session = await authApi.me()
        this.setAuthenticated(session.user)

        return session.user
      } catch (error) {
        this.setAnonymous(normalizeAuthError(error, 'session'))

        return null
      }
    },

    async restoreSession() {
      const pendingRequest = restoreSessionRequests.get(this)

      if (pendingRequest) {
        return pendingRequest
      }

      const request = this.runRestoreSession()
      restoreSessionRequests.set(this, request)

      try {
        return await request
      } finally {
        if (restoreSessionRequests.get(this) === request) {
          restoreSessionRequests.delete(this)
        }
      }
    },

    async runRestoreSession() {
      if (this.user) {
        this.setAuthenticated(this.user)

        return this.user
      }

      this.startRequest()

      try {
        const session = await authApi.session()
        this.setAuthenticated(session.user)

        return session.user
      } catch {
        this.setAnonymous()

        return null
      }
    },

    async refreshSession() {
      const pendingRequest = refreshSessionRequests.get(this)

      if (pendingRequest) {
        return pendingRequest
      }

      const request = this.runRefreshSession()
      refreshSessionRequests.set(this, request)

      try {
        return await request
      } finally {
        if (refreshSessionRequests.get(this) === request) {
          refreshSessionRequests.delete(this)
        }
      }
    },

    async runRefreshSession() {
      this.startRequest()

      try {
        const session = await authApi.refresh()
        this.setAuthenticated(session.user)

        return session.user
      } catch (error) {
        this.setAnonymous(normalizeAuthError(error, 'refresh'))

        throw error
      }
    },

    async logout() {
      this.startRequest()

      try {
        await authApi.logout()
      } finally {
        this.setAnonymous()
      }
    },

    clearError() {
      this.error = null
    },
  },
})
