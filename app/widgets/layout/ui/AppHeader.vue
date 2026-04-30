<script setup lang="ts">
import { useAuthStore } from '@/entities/session/model/auth.store'
import UserBadge from '@/widgets/layout/ui/UserBadge.vue'

const authStore = useAuthStore()
const localePath = useLocalePath()

const username = computed(() => authStore.user?.username || '')

const logout = async () => {
  await authStore.logout()
  await navigateTo(localePath('/auth'))
}
</script>

<template>
  <header class="border-b border-border bg-background/95">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
      <NuxtLink
        class="text-base font-semibold tracking-tight text-foreground"
        :to="localePath('/')"
      >
        {{ $t('app.name') }}
      </NuxtLink>

      <div class="flex items-center gap-4">
        <NuxtLink to="/profile">
          <UserBadge :username="username" />
        </NuxtLink>

        <BaseButton
          size="md"
          type="button"
          variant="secondary"
          @click="logout"
        >
          {{ $t('layout.header.logout') }}
        </BaseButton>
      </div>
    </div>
  </header>
</template>
