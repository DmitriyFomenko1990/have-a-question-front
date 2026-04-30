import { describe, expect, it } from 'vitest'
import { createLoginSchema, createRegisterSchema } from '@/features/auth/model/validation'

const t = (key: string) => key

describe('auth validation schemas', () => {
  it('accepts valid login values', () => {
    const result = createLoginSchema(t).safeParse({
      email: 'user@example.com',
      password: 'password',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid login email', () => {
    const result = createLoginSchema(t).safeParse({
      email: 'invalid',
      password: 'password',
    })

    expect(result.success).toBe(false)
  })

  it('accepts valid registration values', () => {
    const result = createRegisterSchema(t).safeParse({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
      password_confirm: 'password',
    })

    expect(result.success).toBe(true)
  })

  it('rejects password mismatch', () => {
    const result = createRegisterSchema(t).safeParse({
      username: 'user',
      email: 'user@example.com',
      password: 'password',
      password_confirm: 'different',
    })

    expect(result.success).toBe(false)
  })
})
