<script setup lang="ts">
import QuestionCard from '@/entities/question/ui/QuestionCard.vue'
import { questionsApi } from '@/shared/api/questions/questions.api'

definePageMeta({
  layout: 'protected',
})

const localePath = useLocalePath()

const {
  data: questions,
  error,
  pending,
  refresh,
} = await useAsyncData('questions:list', () => questionsApi.list(), {
  default: () => [],
})
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-6 py-8 sm:py-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {{ $t('home.questions.title') }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {{ $t('home.questions.description') }}
        </p>
      </div>
    </div>

    <div
      v-if="pending"
      class="mt-8 rounded-3xl border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm"
    >
      {{ $t('home.questions.loading') }}
    </div>

    <div
      v-else-if="error"
      class="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 shadow-sm"
    >
      <h2 class="text-lg font-semibold text-red-500">
        {{ $t('home.questions.errorTitle') }}
      </h2>
      <p class="mt-2 text-sm leading-6 text-red-500">
        {{ $t('home.questions.errorDescription') }}
      </p>
      <BaseButton
        class="mt-5 w-full sm:w-auto"
        type="button"
        variant="secondary"
        @click="refresh"
      >
        {{ $t('home.questions.retry') }}
      </BaseButton>
    </div>

    <div
      v-else-if="questions.length === 0"
      class="mt-8 rounded-3xl border border-border bg-background p-8 text-center shadow-sm"
    >
      <h2 class="text-2xl font-semibold tracking-tight text-foreground">
        {{ $t('home.questions.emptyTitle') }}
      </h2>
      <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        {{ $t('home.questions.emptyDescription') }}
      </p>
      <BaseButton
        as-child
        class="mt-6 w-full sm:w-auto"
      >
        <NuxtLink :to="localePath('/questions/new')">
          {{ $t('home.questions.emptyAction') }}
        </NuxtLink>
      </BaseButton>
    </div>

    <div
      v-else
      class="mt-8 grid gap-4"
    >
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
      />
    </div>
  </section>
</template>
