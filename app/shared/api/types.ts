import type { components, operations, paths } from './generated/schema'

export type ApiPaths = paths
export type ApiUser = components['schemas']['User']
export type ApiRegisterPayload = Pick<components['schemas']['Register'], 'email' | 'username' | 'password' | 'password_confirm'>
export type ApiRegisterResponse =
  operations['auth_register_create']['responses'][201]['content']['application/json']
export type ApiLoginPayload = Pick<components['schemas']['TokenObtainPair'], 'email' | 'password'>
export type ApiTokenPair = Pick<components['schemas']['TokenObtainPair'], 'access' | 'refresh'>
export type ApiTokenRefreshPayload = Pick<components['schemas']['TokenRefresh'], 'refresh'>
export type ApiTokenRefresh = Pick<components['schemas']['TokenRefresh'], 'access'>
