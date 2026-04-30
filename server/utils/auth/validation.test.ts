import { describe, expect, it } from 'vitest'
import { loginPayloadSchema, registerPayloadSchema } from './validation'

describe('server auth validation', () => {
  it('accepts valid login payload', () => {
    expect(loginPayloadSchema.safeParse({
      email: 'user@example.com',
      password: 'password',
    }).success).toBe(true)
  })

  it('rejects extra login fields', () => {
    expect(loginPayloadSchema.safeParse({
      email: 'user@example.com',
      password: 'password',
      role: 'admin',
    }).success).toBe(false)
  })

  it('accepts valid register payload', () => {
    expect(registerPayloadSchema.safeParse({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
      password_confirm: 'password',
    }).success).toBe(true)
  })

  it('rejects register password mismatch', () => {
    expect(registerPayloadSchema.safeParse({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
      password_confirm: 'different',
    }).success).toBe(false)
  })
})
