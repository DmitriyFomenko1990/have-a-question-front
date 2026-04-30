export type AuthErrorContext = 'login' | 'register' | 'session' | 'refresh' | 'request'

export type AuthErrorCode =
  | 'invalidCredentials'
  | 'sessionExpired'
  | 'unauthorized'
  | 'validation'
  | 'network'
  | 'server'
  | 'unknown'

export type AuthError = {
  code: AuthErrorCode
  statusCode: number | null
  messageKey: string
}

const getErrorStatusCode = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return null
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.status
  }

  if ('response' in error) {
    const response = error.response

    if (response && typeof response === 'object' && 'status' in response && typeof response.status === 'number') {
      return response.status
    }
  }

  return null
}

const getAuthErrorCode = (statusCode: number | null, context: AuthErrorContext): AuthErrorCode => {
  if (statusCode === 400 || statusCode === 422) {
    return 'validation'
  }

  if (statusCode === 401) {
    if (context === 'login') {
      return 'invalidCredentials'
    }

    if (context === 'session' || context === 'refresh') {
      return 'sessionExpired'
    }

    return 'unauthorized'
  }

  if (statusCode === 403) {
    return 'unauthorized'
  }

  if (statusCode && statusCode >= 500) {
    return 'server'
  }

  if (!statusCode) {
    return 'network'
  }

  return 'unknown'
}

const authErrorMessageKeys: Record<AuthErrorCode, string> = {
  invalidCredentials: 'auth.errors.invalidCredentials',
  sessionExpired: 'auth.errors.sessionExpired',
  unauthorized: 'auth.errors.unauthorized',
  validation: 'auth.errors.validation',
  network: 'auth.errors.network',
  server: 'auth.errors.server',
  unknown: 'auth.errors.generic',
}

export const normalizeAuthError = (error: unknown, context: AuthErrorContext = 'request'): AuthError => {
  const statusCode = getErrorStatusCode(error)
  const code = getAuthErrorCode(statusCode, context)

  return {
    code,
    statusCode,
    messageKey: authErrorMessageKeys[code],
  }
}
