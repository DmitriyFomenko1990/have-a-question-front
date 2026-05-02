<script setup lang="ts">
import CreateQuestionForm from '@/features/questions/ui/CreateQuestionForm.vue'

definePageMeta({
  layout: 'protected',
})

const router = useRouter()
const localePath = useLocalePath()

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()

    return
  }

  return navigateTo(localePath('/profile'))
}

const handleSuccess = () => navigateTo(localePath('/profile'))
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-6 py-8 sm:py-10">
    <button
      class="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
      type="button"
      @click="goBack"
    >
      <svg
        aria-hidden="true"
        class="size-4"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
      {{ $t('questions.create.back') }}
    </button>

    <div class="mt-8">
      <h1 class="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {{ $t('questions.create.title') }}
      </h1>
      <p class="mt-3 text-sm leading-6 text-muted-foreground">
        {{ $t('questions.create.description') }}
      </p>
    </div>

    <div class="mt-8 rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-6">
      <CreateQuestionForm @success="handleSuccess" />
    </div>
  </section>
</template>
