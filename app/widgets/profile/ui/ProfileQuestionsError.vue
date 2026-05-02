<script setup lang="ts">
const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 shadow-sm">
    <h3 class="text-lg font-semibold text-red-500">
      {{ $t('profile.questions.errorTitle') }}
    </h3>
    <p class="mt-2 text-sm leading-6 text-red-500">
      {{ $t('profile.questions.errorDescription') }}
    </p>
    <BaseButton
      class="mt-5 w-full sm:w-auto"
      type="button"
      variant="secondary"
      @click="emit('refresh')"
    >
      {{ $t('profile.questions.retry') }}
    </BaseButton>
  </div>
</template>
