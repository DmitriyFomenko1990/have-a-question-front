import { useAuthStore } from '@/entities/session/model/auth.store'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  const authPath = localePath('/auth')
  const homePath = localePath('/')
  const isAuthRoute = to.path === authPath

  if (!authStore.user) {
    await authStore.restoreSession()
  }

  if (!authStore.isAuthenticated && !isAuthRoute) {
    return navigateTo(authPath)
  }

  if (authStore.isAuthenticated && isAuthRoute) {
    return navigateTo(homePath)
  }
})
