<script setup lang="ts">
import QuestionCard from '@/entities/question/ui/QuestionCard.vue'
import type { ApiQuestionListItem } from '@/shared/api/types'
import ProfileQuestionsEmpty from '@/widgets/profile/ui/ProfileQuestionsEmpty.vue'
import ProfileQuestionsError from '@/widgets/profile/ui/ProfileQuestionsError.vue'
import ProfileQuestionsLoading from '@/widgets/profile/ui/ProfileQuestionsLoading.vue'

defineProps<{
  questions: ApiQuestionListItem[]
  pending: boolean
  error: unknown
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl border border-border bg-background p-5 shadow-sm">
      <h2 class="text-xl font-semibold tracking-tight text-foreground">
        {{ $t('profile.questions.title') }}
      </h2>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        {{ $t('profile.questions.description') }}
      </p>
    </div>

    <ProfileQuestionsLoading v-if="pending" />

    <ProfileQuestionsError
      v-else-if="error"
      @refresh="emit('refresh')"
    />

    <ProfileQuestionsEmpty v-else-if="questions.length === 0" />

    <template v-else>
      <QuestionCard
        v-for="question in questions"
        :key="question.id"
        my-question
        :question="question"
      />
    </template>
  </div>
</template>
