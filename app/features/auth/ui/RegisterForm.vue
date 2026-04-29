<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { createRegisterSchema, type RegisterFormValues } from '@/features/auth/model/validation'
import { useAuthStore } from '@/entities/session/model/auth.store'
import type { ApiRegisterPayload } from '@/shared/api/types'

const emit = defineEmits<{
  success: []
}>()

const authStore = useAuthStore()
const { t } = useI18n()

const { defineField, errors, handleSubmit } = useForm<RegisterFormValues>({
  validationSchema: toTypedSchema(createRegisterSchema(t)),
  initialValues: {
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  },
})

const [username, usernameAttrs] = defineField('username')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirm, passwordConfirmAttrs] = defineField('password_confirm')

const onSubmit = handleSubmit(async (values) => {
  authStore.clearError()

  await authStore.registerAndLogin({
    username: values.username,
    email: values.email,
    password: values.password,
    password_confirm: values.password_confirm,
  } satisfies ApiRegisterPayload)

  emit('success')
})
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="onSubmit"
  >
    <BaseField
      :error="errors.username"
      :label="$t('auth.form.usernameLabel')"
    >
      <BaseInput
        v-model="username"
        v-bind="usernameAttrs"
        autocomplete="username"
        :placeholder="$t('auth.form.usernamePlaceholder')"
      />
    </BaseField>

    <BaseField
      :error="errors.email"
      :label="$t('auth.form.emailLabel')"
    >
      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        autocomplete="email"
        :placeholder="$t('auth.form.emailPlaceholder')"
        type="email"
      />
    </BaseField>

    <BaseField
      :error="errors.password"
      :label="$t('auth.form.passwordLabel')"
    >
      <BaseInput
        v-model="password"
        v-bind="passwordAttrs"
        autocomplete="new-password"
        :placeholder="$t('auth.form.passwordPlaceholder')"
        type="password"
      />
    </BaseField>

    <BaseField
      :error="errors.password_confirm"
      :label="$t('auth.form.passwordConfirmLabel')"
    >
      <BaseInput
        v-model="passwordConfirm"
        v-bind="passwordConfirmAttrs"
        autocomplete="new-password"
        :placeholder="$t('auth.form.passwordConfirmPlaceholder')"
        type="password"
      />
    </BaseField>

    <BaseFormError v-if="authStore.error">
      {{ authStore.error }}
    </BaseFormError>

    <BaseButton
      class="w-full"
      :disabled="authStore.isPending"
      type="submit"
    >
      {{ authStore.isPending ? $t('auth.form.pendingSubmit') : $t('auth.form.registerSubmit') }}
    </BaseButton>
  </form>
</template>
