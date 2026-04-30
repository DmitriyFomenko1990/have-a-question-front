import { describe, expect, it } from 'vitest'
import { normalizeAuthError } from '@/entities/session/model/auth.errors'

describe('normalizeAuthError', () => {
  it('maps login 401 to invalid credentials', () => {
    expect(normalizeAuthError({ statusCode: 401 }, 'login')).toMatchObject({
      code: 'invalidCredentials',
      messageKey: 'auth.errors.invalidCredentials',
      statusCode: 401,
    })
  })

  it('maps session 401 to expired session', () => {
    expect(normalizeAuthError({ response: { status: 401 } }, 'session')).toMatchObject({
      code: 'sessionExpired',
      messageKey: 'auth.errors.sessionExpired',
      statusCode: 401,
    })
  })

  it('maps missing status to network error', () => {
    expect(normalizeAuthError(new Error('failed'), 'request')).toMatchObject({
      code: 'network',
      messageKey: 'auth.errors.network',
      statusCode: null,
    })
  })
})
