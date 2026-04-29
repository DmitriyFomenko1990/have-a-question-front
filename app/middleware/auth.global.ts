import { useAuthStore } from '@/entities/session/model/auth.store'

const authPath = '/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const isAuthRoute = to.path === authPath

  if (!authStore.user) {
    await authStore.restoreSession()
  }

  if (!authStore.isAuthenticated && !isAuthRoute) {
    return navigateTo(authPath)
  }

  if (authStore.isAuthenticated && isAuthRoute) {
    return navigateTo('/')
  }
})
