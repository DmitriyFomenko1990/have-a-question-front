import { z } from 'zod'

type Translate = (key: string) => string

export const createLoginSchema = (t: Translate) =>
  z.object({
    email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  })

export const createRegisterSchema = (t: Translate) =>
  z
    .object({
      username: z.string().min(1, t('auth.validation.usernameRequired')).max(50, t('auth.validation.usernameMax')),
      email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
      password: z.string().min(8, t('auth.validation.passwordMin')),
      password_confirm: z.string().min(1, t('auth.validation.passwordConfirmRequired')),
    })
    .refine((values) => values.password === values.password_confirm, {
      path: ['password_confirm'],
      message: t('auth.validation.passwordMismatch'),
    })

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>
