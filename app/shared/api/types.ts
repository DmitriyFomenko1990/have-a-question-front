import type { components, paths } from './generated/schema'

export type ApiPaths = paths
export type ApiUser = components['schemas']['User']
export type ApiRegisterPayload = components['schemas']['Register']
export type ApiTokenPair = components['schemas']['TokenObtainPair']
export type ApiTokenRefresh = components['schemas']['TokenRefresh']
