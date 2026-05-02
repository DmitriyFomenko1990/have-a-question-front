<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="rounded-3xl border border-border bg-background p-8 text-center shadow-sm">
    <h3 class="text-2xl font-semibold tracking-tight text-foreground">
      {{ $t('profile.questions.emptyTitle') }}
    </h3>
    <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
      {{ $t('profile.questions.emptyDescription') }}
    </p>
    <BaseButton
      as-child
      class="mt-6 w-full sm:w-auto"
    >
      <NuxtLink :to="localePath('/questions/new')">
        {{ $t('profile.questions.emptyAction') }}
      </NuxtLink>
    </BaseButton>
  </div>
</template>
