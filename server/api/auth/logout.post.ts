export default defineEventHandler((event): { success: boolean } => {
  clearAuthTokens(event)

  return {
    success: true,
  }
})
