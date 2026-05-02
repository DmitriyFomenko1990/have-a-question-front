<script setup lang="ts">
import { questionsApi } from '@/shared/api/questions/questions.api'
import ProfilePersonalCard from '@/widgets/profile/ui/ProfilePersonalCard.vue'
import ProfileQuestionsPanel from '@/widgets/profile/ui/ProfileQuestionsPanel.vue'

definePageMeta({
  layout: 'protected',
})

const localePath = useLocalePath()

const {
  data: myQuestions,
  error: myQuestionsError,
  pending: myQuestionsPending,
  refresh: refreshMyQuestions,
} = await useAsyncData('questions:my', () => questionsApi.my(), {
  default: () => [],
})

const stats = [
  {
    labelKey: 'dashboard.profile.stats.questions',
    value: '12',
  },
  {
    labelKey: 'dashboard.profile.stats.polls',
    value: '4',
  },
  {
    labelKey: 'dashboard.profile.stats.active',
    value: '7',
  },
]
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-6 py-8 sm:py-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {{ $t('dashboard.hero.title') }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {{ $t('dashboard.hero.description') }}
        </p>
      </div>

      <BaseButton
        as-child
        class="w-full sm:w-auto"
      >
        <NuxtLink :to="localePath('/questions/new')">
          {{ $t('dashboard.actions.create') }}
        </NuxtLink>
      </BaseButton>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <ProfilePersonalCard :stats="stats" />

      <ProfileQuestionsPanel
        :error="myQuestionsError"
        :pending="myQuestionsPending"
        :questions="myQuestions"
        @refresh="refreshMyQuestions"
      />
    </div>
  </section>
</template>
