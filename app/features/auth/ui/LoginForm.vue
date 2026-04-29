<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { createLoginSchema, type LoginFormValues } from '@/features/auth/model/validation'
import { useAuthStore } from '@/entities/session/model/auth.store'
import type { ApiLoginPayload } from '@/shared/api/types'

const emit = defineEmits<{
  success: []
}>()

const authStore = useAuthStore()
const { t } = useI18n()

const { defineField, errors, handleSubmit } = useForm<LoginFormValues>({
  validationSchema: toTypedSchema(createLoginSchema(t)),
  initialValues: {
    email: '',
    password: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  authStore.clearError()

  await authStore.login({
    email: values.email,
    password: values.password,
  } satisfies ApiLoginPayload)

  emit('success')
})
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="onSubmit"
  >
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
        autocomplete="current-password"
        :placeholder="$t('auth.form.passwordPlaceholder')"
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
      {{ authStore.isPending ? $t('auth.form.pendingSubmit') : $t('auth.form.loginSubmit') }}
    </BaseButton>
  </form>
</template>
