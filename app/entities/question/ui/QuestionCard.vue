<script setup lang="ts">
import QuestionAnswerForm from '@/entities/question/ui/QuestionAnswerForm.vue'
import type { ApiQuestionListItem } from '@/shared/api/types'

const props = defineProps<{
  question: ApiQuestionListItem
}>()

const { locale } = useI18n()

const createdAt = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(props.question.created_at)),
)
</script>

<template>
  <article class="rounded-3xl border border-border bg-background p-5 shadow-sm transition hover:bg-muted/40">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold tracking-tight text-foreground">
          {{ question.title }}
        </h2>
        <p
          v-if="question.description"
          class="mt-2 text-sm leading-6 text-muted-foreground"
        >
          {{ question.description }}
        </p>
      </div>

      <p class="shrink-0 text-sm font-medium text-muted-foreground">
        {{ createdAt }}
      </p>
    </div>

    <QuestionAnswerForm :question="question" />
  </article>
</template>
