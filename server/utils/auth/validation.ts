import type { H3Event } from 'h3'
import { z } from 'zod'
import type { ApiLoginPayload, ApiRegisterPayload } from '@/shared/api/types'

export const loginPayloadSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict()

export const registerPayloadSchema = z
  .object({
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    password_confirm: z.string().min(1),
  })
  .strict()
  .refine((values) => values.password === values.password_confirm, {
    path: ['password_confirm'],
  })

const createInvalidAuthBodyError = () =>
  createError({
    statusCode: 400,
    statusMessage: 'Invalid auth request body',
  })

export const readLoginBody = async (event: H3Event): Promise<ApiLoginPayload> => {
  const result = loginPayloadSchema.safeParse(await readBody<unknown>(event))

  if (!result.success) {
    throw createInvalidAuthBodyError()
  }

  return result.data
}

export const readRegisterBody = async (event: H3Event): Promise<ApiRegisterPayload> => {
  const result = registerPayloadSchema.safeParse(await readBody<unknown>(event))

  if (!result.success) {
    throw createInvalidAuthBodyError()
  }

  return result.data
}
