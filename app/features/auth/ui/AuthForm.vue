<script setup lang="ts">
import LoginForm from '@/features/auth/ui/LoginForm.vue'
import RegisterForm from '@/features/auth/ui/RegisterForm.vue'
import { useAuthStore } from '@/entities/session/model/auth.store'

type AuthMode = 'login' | 'register'

const authStore = useAuthStore()
const { t } = useI18n()
const mode = ref<AuthMode>('login')

const modeOptions = computed(() => [
  {
    label: t('auth.form.loginTab'),
    value: 'login',
  },
  {
    label: t('auth.form.registerTab'),
    value: 'register',
  },
])

watch(mode, () => {
  authStore.clearError()
})

const handleSuccess = async () => {
  await navigateTo('/')
}
</script>

<template>
  <section class="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-sm">
    <div class="mb-8">
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {{ $t('auth.form.title') }}
      </h1>
      <p class="mt-3 text-sm leading-6 text-muted-foreground">
        {{ $t('auth.form.description') }}
      </p>
    </div>

    <div class="mb-6">
      <BaseSegmentedControl
        v-model="mode"
        :options="modeOptions"
      />
    </div>

    <LoginForm
      v-if="mode === 'login'"
      @success="handleSuccess"
    />
    <RegisterForm
      v-else
      @success="handleSuccess"
    />
  </section>
</template>
