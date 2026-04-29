import type { H3Event } from 'h3'

const accessTokenCookieName = 'haq_access_token'
const refreshTokenCookieName = 'haq_refresh_token'

const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: !import.meta.dev,
  path: '/',
})

export const getAuthAccessToken = (event: H3Event) => getCookie(event, accessTokenCookieName)

export const getAuthRefreshToken = (event: H3Event) => getCookie(event, refreshTokenCookieName)

export const setAuthTokens = (
  event: H3Event,
  tokens: {
    access: string
    refresh?: string
  },
) => {
  setCookie(event, accessTokenCookieName, tokens.access, getAuthCookieOptions())

  if (tokens.refresh) {
    setCookie(event, refreshTokenCookieName, tokens.refresh, getAuthCookieOptions())
  }
}

export const clearAuthTokens = (event: H3Event) => {
  deleteCookie(event, accessTokenCookieName, getAuthCookieOptions())
  deleteCookie(event, refreshTokenCookieName, getAuthCookieOptions())
}
