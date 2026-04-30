<script setup lang="ts">
definePageMeta({
  layout: 'protected',
})

type QuestionStatus = 'active' | 'closed'
type QuestionSort = 'newest' | 'oldest' | 'activity'
type DashboardTab = 'questions' | 'polls'

const { t } = useI18n()
const localePath = useLocalePath()

const activeTab = ref<DashboardTab>('questions')
const questionQuery = ref('')
const questionStatus = ref<'all' | QuestionStatus>('all')
const questionSort = ref<QuestionSort>('newest')

const tabOptions = computed(() => [
  {
    label: t('dashboard.tabs.questions'),
    value: 'questions',
  },
  {
    label: t('dashboard.tabs.polls'),
    value: 'polls',
  },
])

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

const questions = [
  {
    id: 1,
    titleKey: 'dashboard.questions.items.product.title',
    descriptionKey: 'dashboard.questions.items.product.description',
    status: 'active' satisfies QuestionStatus,
    createdAt: '2026-04-29',
    answers: 18,
    activity: 42,
  },
  {
    id: 2,
    titleKey: 'dashboard.questions.items.design.title',
    descriptionKey: 'dashboard.questions.items.design.description',
    status: 'active' satisfies QuestionStatus,
    createdAt: '2026-04-24',
    answers: 9,
    activity: 27,
  },
  {
    id: 3,
    titleKey: 'dashboard.questions.items.research.title',
    descriptionKey: 'dashboard.questions.items.research.description',
    status: 'closed' satisfies QuestionStatus,
    createdAt: '2026-04-18',
    answers: 31,
    activity: 64,
  },
]

const polls = [
  {
    id: 1,
    titleKey: 'dashboard.polls.items.feature.title',
    descriptionKey: 'dashboard.polls.items.feature.description',
    statusKey: 'dashboard.polls.status.active',
    createdAt: '2026-04-28',
    participants: 128,
  },
  {
    id: 2,
    titleKey: 'dashboard.polls.items.navigation.title',
    descriptionKey: 'dashboard.polls.items.navigation.description',
    statusKey: 'dashboard.polls.status.draft',
    createdAt: '2026-04-21',
    participants: 0,
  },
]

const filteredQuestions = computed(() => {
  const normalizedQuery = questionQuery.value.trim().toLowerCase()

  return [...questions]
    .filter((question) => {
      const matchesStatus = questionStatus.value === 'all' || question.status === questionStatus.value
      const title = t(question.titleKey).toLowerCase()
      const description = t(question.descriptionKey).toLowerCase()
      const matchesQuery = !normalizedQuery || title.includes(normalizedQuery) || description.includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
    .sort((firstQuestion, secondQuestion) => {
      if (questionSort.value === 'activity') {
        return secondQuestion.activity - firstQuestion.activity
      }

      const firstDate = new Date(firstQuestion.createdAt).getTime()
      const secondDate = new Date(secondQuestion.createdAt).getTime()

      return questionSort.value === 'newest' ? secondDate - firstDate : firstDate - secondDate
    })
})
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-6 py-8 sm:py-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-primary">
          {{ $t('dashboard.hero.eyebrow') }}
        </p>
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
      <aside class="rounded-3xl border border-border bg-background p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {{ $t('dashboard.profile.initials') }}
          </div>
          <div>
            <p class="text-sm font-semibold text-muted-foreground">
              {{ $t('dashboard.profile.label') }}
            </p>
            <h2 class="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {{ $t('dashboard.profile.name') }}
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ $t('dashboard.profile.email') }}
            </p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.labelKey"
            class="rounded-2xl bg-muted p-4"
          >
            <p class="text-2xl font-semibold text-foreground">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-xs font-medium text-muted-foreground">
              {{ $t(stat.labelKey) }}
            </p>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-border p-4">
          <p class="text-sm font-semibold text-foreground">
            {{ $t('dashboard.profile.aboutTitle') }}
          </p>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            {{ $t('dashboard.profile.aboutDescription') }}
          </p>
        </div>
      </aside>

      <div class="rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-6">
        <BaseSegmentedControl
          v-model="activeTab"
          :options="tabOptions"
        />

        <div
          v-if="activeTab === 'questions'"
          class="mt-6"
        >
          <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
            <BaseInput
              v-model="questionQuery"
              :placeholder="$t('dashboard.questions.filters.searchPlaceholder')"
              type="search"
            />
            <select
              v-model="questionStatus"
              class="h-11 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">
                {{ $t('dashboard.questions.filters.status.all') }}
              </option>
              <option value="active">
                {{ $t('dashboard.questions.filters.status.active') }}
              </option>
              <option value="closed">
                {{ $t('dashboard.questions.filters.status.closed') }}
              </option>
            </select>
            <select
              v-model="questionSort"
              class="h-11 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="newest">
                {{ $t('dashboard.questions.filters.sort.newest') }}
              </option>
              <option value="oldest">
                {{ $t('dashboard.questions.filters.sort.oldest') }}
              </option>
              <option value="activity">
                {{ $t('dashboard.questions.filters.sort.activity') }}
              </option>
            </select>
          </div>

          <div class="mt-5 space-y-3">
            <article
              v-for="question in filteredQuestions"
              :key="question.id"
              class="rounded-3xl border border-border p-5 transition hover:bg-muted/50"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span class="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {{ $t(`dashboard.questions.status.${question.status}`) }}
                  </span>
                  <h3 class="mt-3 text-lg font-semibold text-foreground">
                    {{ $t(question.titleKey) }}
                  </h3>
                  <p class="mt-2 text-sm leading-6 text-muted-foreground">
                    {{ $t(question.descriptionKey) }}
                  </p>
                </div>
                <p class="shrink-0 text-sm font-medium text-muted-foreground">
                  {{ question.createdAt }}
                </p>
              </div>

              <div class="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{{ $t('dashboard.questions.meta.answers', { count: question.answers }) }}</span>
                <span>{{ $t('dashboard.questions.meta.activity', { count: question.activity }) }}</span>
              </div>
            </article>
          </div>
        </div>

        <div
          v-else
          class="mt-6"
        >
          <div class="flex flex-col gap-4 rounded-3xl bg-muted p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-foreground">
                {{ $t('dashboard.polls.title') }}
              </h2>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ $t('dashboard.polls.description') }}
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

          <div class="mt-5 space-y-3">
            <article
              v-for="poll in polls"
              :key="poll.id"
              class="rounded-3xl border border-border p-5 transition hover:bg-muted/50"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span class="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {{ $t(poll.statusKey) }}
                  </span>
                  <h3 class="mt-3 text-lg font-semibold text-foreground">
                    {{ $t(poll.titleKey) }}
                  </h3>
                  <p class="mt-2 text-sm leading-6 text-muted-foreground">
                    {{ $t(poll.descriptionKey) }}
                  </p>
                </div>
                <p class="shrink-0 text-sm font-medium text-muted-foreground">
                  {{ poll.createdAt }}
                </p>
              </div>

              <div class="mt-4 text-sm text-muted-foreground">
                {{ $t('dashboard.polls.meta.participants', { count: poll.participants }) }}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
