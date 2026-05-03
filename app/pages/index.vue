<script setup lang="ts">
import QuestionCard from '@/entities/question/ui/QuestionCard.vue'
import { questionsApi } from '@/shared/api/questions/questions.api'
import type { ApiQuestionAnsweredFilter, ApiQuestionSearchPayload, ApiQuestionSort, ApiQuestionSortType } from '@/shared/api/types'

definePageMeta({
  layout: 'protected',
})

const localePath = useLocalePath()
const search = ref('')
const answered = ref<ApiQuestionAnsweredFilter>('all')
const sort = ref<ApiQuestionSort>('created_at')
const sortType = ref<ApiQuestionSortType>('desc')

const searchPayload = computed<ApiQuestionSearchPayload>(() => ({
  search: search.value.trim(),
  answered: answered.value,
  sort: sort.value,
  sort_type: sortType.value,
}))

const {
  data: questions,
  error,
  pending,
  refresh,
} = await useAsyncData('questions:search', () => questionsApi.search(searchPayload.value), {
  default: () => [],
  watch: [answered, sort, sortType],
})

const refreshDebounced = useDebounceFn(() => {
  refresh()
}, 400)

watch(search, () => {
  refreshDebounced()
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

    <div class="mt-8 rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-5">
      <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
        <BaseInput
          v-model="search"
          :placeholder="$t('home.questions.filters.searchPlaceholder')"
          type="search"
        />

        <select
          v-model="answered"
          class="h-11 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">
            {{ $t('home.questions.filters.answered.all') }}
          </option>
          <option value="false">
            {{ $t('home.questions.filters.answered.unanswered') }}
          </option>
          <option value="true">
            {{ $t('home.questions.filters.answered.answered') }}
          </option>
        </select>

        <select
          v-model="sort"
          class="h-11 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="created_at">
            {{ $t('home.questions.filters.sort.createdAt') }}
          </option>
          <option value="responses_count">
            {{ $t('home.questions.filters.sort.responsesCount') }}
          </option>
        </select>

        <select
          v-model="sortType"
          class="h-11 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="desc">
            {{ $t('home.questions.filters.sortType.desc') }}
          </option>
          <option value="asc">
            {{ $t('home.questions.filters.sortType.asc') }}
          </option>
          <option value="default">
            {{ $t('home.questions.filters.sortType.default') }}
          </option>
        </select>
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
